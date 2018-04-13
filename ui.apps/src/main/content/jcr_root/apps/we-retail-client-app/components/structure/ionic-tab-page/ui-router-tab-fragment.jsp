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
          import="com.day.cq.commons.inherit.InheritanceValueMap,
                  com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap" %><%
%><%@include file="/libs/foundation/global.jsp" %><%
    ValueMap resourcePageProps = resourcePage.getContentResource().adaptTo(ValueMap.class);
    String tabIconOffCSSClass = resourcePageProps.get("tabIconOffCSSClass", "ion-ios-more-outline");
    String tabIconOnCSSClass = resourcePageProps.get("tabIconOnCSSClass", "ion-ios-more");
    String controllerNameStripped = resource.getPath().replaceAll("[^A-Za-z0-9]", "");
    InheritanceValueMap inheritedProperties = new HierarchyNodeInheritanceValueMap(resourcePage.getContentResource());
    String tabViewName = "tab-" + inheritedProperties.getInherited("ui-router-tabViewName", controllerNameStripped);
	String tabTitle = resourcePage.getNavigationTitle() != null ? resourcePage.getNavigationTitle() : resourcePage.getTitle();
%>
    <ion-tab href="#<%= xssAPI.getValidHref(resource.getPath()) %>"
            title="<%= xssAPI.encodeForHTMLAttr(tabTitle) %>"
            icon-off="<%= xssAPI.encodeForHTMLAttr(tabIconOffCSSClass) %>"
            icon-on="<%= xssAPI.encodeForHTMLAttr(tabIconOnCSSClass) %>">
        <ion-nav-view name="<%= xssAPI.encodeForHTMLAttr(tabViewName) %>"></ion-nav-view>
    </ion-tab>