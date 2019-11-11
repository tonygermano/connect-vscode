// cwd is the project top level folder
load('init/init_3.7.1.js');

var strict = SerializerFactory.getDefaultSerializationProperties('HL7V2');
strict.put('useStrictParser', true);
var inboundSerializer = SerializerFactory.getSerializer('hl7v2', strict, null);
var outboundSerializer = SerializerFactory.getSerializer('delimited');

// readFile is a rhino shell method
var rawContent = readFile('examples/serializer-factory/msg.txt');
var transformedContent = inboundSerializer.toXML(rawContent);

var msg = new XML(transformedContent);
var tmp = new XML(outboundSerializer.toXML('a,b,c'));

tmp.row.column1 = msg['PID']['PID.5']['XPN.2'].toString();

logger.info(outboundSerializer.fromXML(tmp));