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
%><%@include file="/libs/foundation/global.jsp" %><%
%><%@ page session="false"
            import="com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils,
                    com.day.cq.wcm.api.WCMMode" %>
<%
    // Set attributes to be consumed by template.jsp
    boolean wcmMode = WCMMode.fromRequest(request) != WCMMode.DISABLED;
    request.setAttribute("wcmMode", wcmMode);

    // In edit mode, links must point directly to the page.
    // Otherwise, they should be in the form `#/path/to/page`
    String hrefPrefix = (wcmMode) ? "" : "#";
    String hrefSuffix = (wcmMode) ? ".html" : "";
    request.setAttribute("hrefPrefix", hrefPrefix);
    request.setAttribute("hrefSuffix", hrefSuffix);

    // Controller for this component
    request.setAttribute("componentDataPath", FrameworkContentExporterUtils.getJsFriendlyResourceName(resource.getPath()));
%>