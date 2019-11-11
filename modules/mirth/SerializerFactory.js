exports.SerializerFactory = (function() {

    function SerializerFactory(cx) {
        this.cx = cx;
        
        const datatypes = cx.com.mirth.connect.plugins.datatypes;
        const dataPluginClasses = [
            datatypes.delimited.DelimitedDataTypeServerPlugin,
            datatypes.dicom.DICOMDataTypeServerPlugin,
            datatypes.edi.EDIDataTypeServerPlugin,
            datatypes.hl7v2.HL7v2DataTypeServerPlugin,
            datatypes.hl7v3.HL7V3DataTypeServerPlugin,
            datatypes.json.JSONDataTypeServerPlugin,
            datatypes.ncpdp.NCPDPDataTypeServerPlugin,
            datatypes.raw.RawDataTypeServerPlugin,
            datatypes.xml.XMLDataTypeServerPlugin
        ];
        
        this.dataPlugins = new cx.org.apache.commons.collections.map.CaseInsensitiveMap(
            dataPluginClasses.reduce(function(obj, javaClass) {
                try {
                    var instance = new javaClass();
                    obj[instance.getPluginPointName()] = instance;
                }
                catch (e) {}
                return obj;
            }, {})
        );
    };

    SerializerFactory.prototype.addDataTypeServerPlugin = function addDataTypeServerPlugin(javaClass) {
        try {
            var instance = new javaClass();
            this.dataPlugins.put(instance.getPluginPointName(), instance);
        }
        catch (e) {}
    };

    SerializerFactory.prototype.getSerializer = function getSerializer(dataType,
            serializationPropertiesMap, deserializationPropertiesMap) {
        var self = this;
        return (arguments.length === 1)
            ? _getSerializer(dataType, null, null)
            : _getSerializer(dataType, serializationPropertiesMap, deserializationPropertiesMap);
        

        function _getSerializer(dataType, serializationPropertiesMap, deserializationPropertiesMap) {
            var plugin = self.dataPlugins.get(dataType);
            if (plugin != null) {
                if (serializationPropertiesMap == null) {
                    serializationPropertiesMap = self.getDefaultSerializationProperties(dataType);
                }
                if (deserializationPropertiesMap == null) {
                    deserializationPropertiesMap = self.getDefaultDeserializationProperties(dataType);
                }
    
                var properties = plugin.getDefaultProperties().getSerializerProperties();
    
                if (properties.getSerializationProperties() != null) {
                    properties.getSerializationProperties().setProperties(serializationPropertiesMap);
                }
                if (properties.getDeserializationProperties() != null) {
                    properties.getDeserializationProperties().setProperties(deserializationPropertiesMap);
                }
    
                return plugin.getSerializer(properties);
            } else {
                return null;
            }
        }
    };

    SerializerFactory.prototype.getDefaultSerializationProperties = function getDefaultSerializationProperties(dataType) {
        var plugin = this.dataPlugins.get(dataType);
        if (plugin != null && plugin.getDefaultProperties().getSerializationProperties() != null) {
            return plugin.getDefaultProperties().getSerializationProperties().getProperties();
        } else {
            return null;
        }
    };

    SerializerFactory.prototype.getDefaultDeserializationProperties = function getDefaultDeserializationProperties(dataType) {
        var plugin = this.dataPlugins.get(dataType);
        if (plugin != null && plugin.getDefaultProperties().getDeserializationProperties() != null) {
            return plugin.getDefaultProperties().getDeserializationProperties().getProperties();
        } else {
            return null;
        }
    };

    return SerializerFactory;
})();