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
%><%@page session="false" %><%
%><%@include file="/libs/foundation/global.jsp" %><%
%><%@page import="com.day.cq.wcm.foundation.Placeholder" %><%
%><cq:include script="overhead.jsp"/><%
    request.setAttribute("locationPath", properties.get("./locationPath", ""));
%>
<c:choose>
    <c:when test="${empty locationPath}">
        <c:if test="${wcmMode}">
            <cq:text property="text" escapeXml="true"
                     placeholder="<%= Placeholder.getDefaultPlaceholder(slingRequest, component, null) %>"/>
        </c:if>
    </c:when>
    <c:otherwise>
        <div class="location-list"  ng-init="init('<c:out value="${componentDataPath}"/>')">
            <div class="list-view" ng-cloak ng-hide="showMap">
                <cq:include script="list.jsp" />
            </div>
            <div class="map-view" ng-show="showMap">
                <cq:include script="map.jsp" />
            </div>
        </div>
    </c:otherwise>
</c:choose>