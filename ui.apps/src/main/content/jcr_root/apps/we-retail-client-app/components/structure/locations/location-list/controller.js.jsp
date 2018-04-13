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
           import="com.day.cq.commons.Externalizer,
                   com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils,
                   com.day.cq.wcm.api.Page"%><%
%><%@include file="/libs/foundation/global.jsp" %><%
%><%
    // Controller for this component
    String locationURI = "";
    String locationPath = properties.get("./locationPath", "");
    if (locationPath.length() > 0) {
        locationURI = locationPath + ".json";
        Externalizer externalizer = sling.getService(Externalizer.class);
        locationURI = externalizer.publishLink(resource.getResourceResolver(), locationURI);
        // Replace localhost with server name if applicable
        if (locationURI.startsWith( "http://localhost" ) || locationURI.startsWith( "https://localhost" )) {
            String serverName = request.getServerName();
            if (serverName != null) {
                locationURI = locationURI.replaceFirst("localhost", serverName);
            }
        }
    }

    pageContext.setAttribute("locationURI", locationURI);
    pageContext.setAttribute("offline", properties.get("./offline", false));
    pageContext.setAttribute("height", properties.get("./height", ""));

    String componentPath = FrameworkContentExporterUtils.getRelativeComponentPath(resource.getPath());
    pageContext.setAttribute("componentPath", componentPath);
    pageContext.setAttribute("componentDataPath", FrameworkContentExporterUtils.getJsFriendlyResourceName(componentPath));

    slingResponse.setContentType("application/javascript");
%>
    /* Location component properties to be accessed by child controller */
    /* <c:out value='${resource.name}'/> component controller (path: <c:out value='${componentPath}'/>) */
    $scope.<c:out value="${componentDataPath}"/> = {
        locationURI: "<c:out value="${locationURI}"/>",
        offline: <c:out value="${offline}"/>,
        mapHeight: "<c:out value="${height}"/>"
    };
    data.then(function(response) {
        $scope.<c:out value="${componentDataPath}"/>.locations = response.data["<c:out value='${componentPath}'/>"].items;
    });
