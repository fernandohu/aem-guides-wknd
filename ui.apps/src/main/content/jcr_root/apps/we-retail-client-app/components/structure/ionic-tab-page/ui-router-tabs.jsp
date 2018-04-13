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
          import="com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils,
                  com.day.cq.wcm.api.Page,
                  com.day.cq.wcm.api.components.IncludeOptions,
                  java.util.Iterator" %><%
%><%@include file="/libs/foundation/global.jsp" %><%
    Page topLevelPage = FrameworkContentExporterUtils.getTopLevelAppResource(resource).adaptTo(Page.class);
    Iterator<Page> topLevelChildPages = topLevelPage.listChildren();
%>
<ion-tabs class="tabs-dark tabs-icon-top tabs-color-active-dark">
    <%
        while (topLevelChildPages.hasNext()) {
            Page tabPage = topLevelChildPages.next();
            // Exclude pages which have excludeFromTabBar == true
            if (tabPage.getProperties().get("ui-router-excludeFromTabBar", false)) {
                continue;
            }
            // Prevent wrapping of tab bar content
            IncludeOptions opts = IncludeOptions.getOptions(request, true);
            opts.setDecorationTagName("");
            opts.forceSameContext(Boolean.TRUE);
                %><cq:include resourceType="<%= tabPage.getContentResource().getResourceType() %>" path='<%= tabPage.getPath() + ".ui-router-tab-fragment.html" %>'/><%
            }
    %>
</ion-tabs>

