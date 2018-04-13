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
                com.adobe.cq.address.api.location.LocationManager,
                com.adobe.cq.address.api.location.Location"%><%
%><%@include file="/libs/foundation/global.jsp"%><%
%><%@include file="../location-list/utils.jsp" %><%

    response.setContentType("application/json");
    response.setCharacterEncoding("utf-8");

    //
    // Return location as JSON data
    //
    TidyJSONWriter writer = new TidyJSONWriter(response.getWriter());

    writer.setTidy(true);

    LocationManager locMgr = slingRequest.getResourceResolver().adaptTo(LocationManager.class);
    Location location = locMgr.getLocation(properties.get("./location", String.class));
    writeLocation(writer, location);

    response.flushBuffer();

%>