# Examples
## serializer-factory

This shows how to use the SerializerFactory implementation. An inbound message is read from a file the serialized to XML using the `hl7v2` data type with the strict parser option enabled. An outbound serializer is set up with the `delimited` data type with default options. A specified template is serialized to XML. A column of `tmp` is assigned a value from a field component of `msg`. Finally, the outbound serializer is used to convert `tmp` back to delimited text.



### msg.txt
Example message taken from: http://www.ringholm.com/docs/04300_en.htm

HL7 Message examples: version 2 and version 3
The contents of this whitepaper are published under the [Creative Commons Attribution-Share Alike license](http://creativecommons.org/licenses/by-sa/3.0/).
See http://www.ringholm.com/docs/04300_en.htm for the latest version of this document.
Editor: René Spronk - Sr.Consultant, Ringholm bv
Document status: Final, version 1.0 (2007-11-16)    