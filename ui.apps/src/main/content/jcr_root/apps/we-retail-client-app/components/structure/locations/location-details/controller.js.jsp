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
           import="com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils"%><%
%><%@include file="/libs/foundation/global.jsp" %><%
%><%
    // Controller for this component
    String componentPath = FrameworkContentExporterUtils.getRelativeComponentPath(resource.getPath());
    pageContext.setAttribute("componentPath", componentPath);
    pageContext.setAttribute("componentDataPath", FrameworkContentExporterUtils.getJsFriendlyResourceName(componentPath));

    slingResponse.setContentType("application/javascript");
%>
    /* <c:out value='${resource.name}'/> component controller (path: <c:out value='${componentPath}'/>) */
    data.then(function(response) {
        $scope.<c:out value="${componentDataPath}"/> = response.data["<c:out value='${componentPath}'/>"];
    });
