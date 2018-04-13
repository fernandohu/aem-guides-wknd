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
                java.util.List,
                com.adobe.cq.address.api.location.LocationManager,
                com.adobe.cq.address.api.location.Location,
                java.util.Iterator"%><%
%><%@include file="/libs/foundation/global.jsp"%><%
%><%@include file="utils.jsp" %><%

    response.setContentType("application/json");
    response.setCharacterEncoding("utf-8");

    //
    // Return all locations as JSON data
    //
    TidyJSONWriter writer = new TidyJSONWriter(response.getWriter());

    writer.setTidy(true);
    writer.object();
    writer.key("items");
    writer.array();

    String offlineStr = properties.get("./offline", "true");
    if (offlineStr.equalsIgnoreCase("true") || offlineStr.equalsIgnoreCase("on")) {
        LocationManager locMgr = slingRequest.getResourceResolver().adaptTo(LocationManager.class);
        List<Location> locationList = locMgr.getLocations(properties.get("./locationPath", String.class));

        if (locationList != null) {
            Iterator<Location> locationIter = locationList.iterator();
            while (locationIter.hasNext()) {
                writeLocation(writer, locationIter.next());
            }
        }
    }

    writer.endArray();
    writer.endObject();

    response.flushBuffer();

%>