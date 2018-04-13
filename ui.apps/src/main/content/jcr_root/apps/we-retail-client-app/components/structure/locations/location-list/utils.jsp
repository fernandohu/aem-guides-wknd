<%--
    Copyright 2016 Adobe Systems Incorporated

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
--%><%
%><%@ page session="false"
           import="com.day.cq.commons.TidyJSONWriter,
                com.adobe.cq.address.api.location.Location,
                com.adobe.cq.address.api.location.Coordinates,
                org.apache.sling.commons.json.JSONException,
                org.apache.commons.lang3.StringUtils, org.apache.sling.api.resource.ValueMap"%><%
%><%!
    public void writeLocation(final TidyJSONWriter writer, final Location location) throws JSONException {
        writer.object();
        if (location != null) {
            ValueMap properties = location.adaptTo(ValueMap.class);
            writer.key("path").value(location.getPath());
            writer.key("name").value(location.getTitle());
            writer.key("description").value(location.getDescription());
            if (location.getCoordinates() != null) {
                writeCoordinates(writer, location.getCoordinates());
            }
            String address = location.getFullAddress();
            address = address.replaceAll(System.getProperty("line.separator"), " ").trim();
            writer.key("address").value(address);
            writer.key("phone").value(location.getPhone());
            writer.key("hours").array();
            writeHours(writer, location.getHours());
            writer.endArray();
            writer.key("timeZone").value(properties.get("timeZone", ""));
        }
        writer.endObject();
    }

    private void writeHours(final TidyJSONWriter writer, final String[] hours) throws JSONException {
        if (hours == null) return;
        for (String hour : hours) {
            if (StringUtils.isBlank(hour)) {
                continue;
            }
            writer.value(hour);
        }
    }

    private void writeCoordinates(final TidyJSONWriter writer, final Coordinates coords) throws JSONException {
        writer.key("coordinates").object();
        writer.key("lat").value(coords.getLat());
        writer.key("lng").value(coords.getLng());
        writer.endObject();
    }
%>