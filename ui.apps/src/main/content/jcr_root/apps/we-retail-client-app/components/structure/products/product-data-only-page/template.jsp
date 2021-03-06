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
%><%@page session="false"
	    import="com.day.cq.wcm.api.WCMMode" %><%
%><%@include file="/libs/foundation/global.jsp" %><%
%><c:set var="wcmMode"><%= WCMMode.fromRequest(request) != WCMMode.DISABLED %></c:set><%
    Resource header = resource.getChild("header");
    boolean nativeChrome = Boolean.parseBoolean(slingRequest.getParameter("nativeChrome"));
%>
<%
    if (nativeChrome == false && header != null) {
%>
<sling:include resource="<%=header%>"/>
<%
    }
%>
%><%-- Template is only needed when WCMMode is enabled --%>
<c:if test="${wcmMode}">

    <ion-content ng-class="{'has-tabs-top': platform.isAndroid()}">
        <cq:include resourceType="foundation/components/parsys" path="content-par"/>
    </ion-content>

</c:if>