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
%><%@include file="/libs/foundation/global.jsp"%><%
%><%@page session="false"
          import="com.day.cq.wcm.foundation.Image,
                   com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils" %><%
    boolean hasImage = false;
    String imageSrc = null;
    Resource imageResource = resourcePage.getContentResource("image");
    if (imageResource != null) {
        Image pageImage = new Image(imageResource);
        if (pageImage != null && pageImage.hasContent()) {
            hasImage = true;
            Resource topLevelAppResource = FrameworkContentExporterUtils.getTopLevelAppResource(resourcePage.adaptTo(Resource.class));
            boolean appExport = Boolean.parseBoolean(slingRequest.getParameter("appExport"));
            imageSrc = FrameworkContentExporterUtils.getPathToAsset(topLevelAppResource, resourcePage.getPath() + ".img.png", appExport);
        }
    }
    String subtitle = resourcePage.getProperties().get("subtitle", "");
%><%
%><c:set var="hasImage"><%= hasImage %></c:set>


<article ng-click="go('<%= xssAPI.getValidHref(resourcePage.getPath()) %>', '<%= xssAPI.encodeForHTMLAttr(resourcePage.getTitle()) %>', null, $event)">
    <c:if test="${hasImage}">
        <img src="<%= xssAPI.getValidHref(imageSrc) %>"/>
    </c:if>

    <header>
        <% if (null != resourcePage.getTitle()) {%>
                <span class="product">
                    <%= xssAPI.encodeForHTML(resourcePage.getTitle()) %>
                </span>
        <%}%>
    </header>
</article>
