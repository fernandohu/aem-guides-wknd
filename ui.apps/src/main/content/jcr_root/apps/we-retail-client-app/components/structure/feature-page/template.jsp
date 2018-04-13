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
          import="com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils,
                  com.day.cq.i18n.I18n,
                  com.day.cq.wcm.api.Page,
                  com.day.cq.wcm.foundation.Image,
                  org.apache.sling.api.resource.Resource,
                  org.apache.sling.api.resource.ValueMap" %><%

    I18n i18n = new I18n(slingRequest);
    String articleAuthor = resourcePage.getProperties().get("author", String.class);

    Page readerPage = resourcePage;
    ValueMap readerPageProperties = readerPage.getContentResource().adaptTo(ValueMap.class);

    boolean hasBackgroundImage = false;
    // background color defaults to #fff (white)
    String backgroundStyle = "background-color:" + readerPageProperties.get("backgroundColor", "#fff") + ";";
    // text color defaults to black
    backgroundStyle += "color:" + readerPageProperties.get("textColor", "#000") + ";";
    backgroundStyle += "background-size:" + readerPageProperties.get("backgroundSize", "cover") + ";height: 100%;";

    Resource imageResource = readerPage.getContentResource("image");
    if (imageResource != null && readerPageProperties.get("showBackgroundImage", "true").equals("true")) {
        Image pageImage = new Image(imageResource);
        if (pageImage != null && pageImage.hasContent()) {
            hasBackgroundImage = true;
            Resource topLevelAppResource = FrameworkContentExporterUtils.getTopLevelAppResource(readerPage.adaptTo(Resource.class));
            boolean appExport = Boolean.parseBoolean(slingRequest.getParameter("appExport"));
            backgroundStyle += "background-image: url('" + FrameworkContentExporterUtils.getPathToAsset(topLevelAppResource, readerPage.getPath() + ".img.png", appExport) + "');";
            backgroundStyle += "background-position:" + readerPageProperties.get("backgroundPosition", "-230px 0px") + ";";
        }
    }
%><c:set var="hasBackgroundImage"><%= hasBackgroundImage %></c:set>

<ion-view hide-nav-bar="true">
    <ion-content>
        <div style="<%= xssAPI.encodeForHTMLAttr(backgroundStyle) %>" class="featured fullscreen <c:if test="${hasBackgroundImage}">has-background-image</c:if>">
            <div class="subheadline">
                <%= i18n.get("Featured") %>
            </div>
            <div class="headline">
                <% if (null != resourcePage.getTitle()) {%>
                    <%= xssAPI.encodeForHTML(resourcePage.getTitle()) %>
                <%}%>
            </div>
            <div class="author">
                <% if (null != articleAuthor) {%>
                    with <%= xssAPI.encodeForHTML(articleAuthor) %>
                <%}%>
            </div>
        </div>
    </ion-content>
</ion-view>



