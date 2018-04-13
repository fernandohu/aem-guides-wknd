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
           import="java.util.Iterator,
                   com.day.cq.wcm.foundation.List,
                   com.day.cq.wcm.api.components.IncludeOptions,
                   com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils,
                   com.day.cq.wcm.foundation.Image,
                   org.apache.sling.api.resource.Resource" %><%
%><%
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
%><%
%><c:set var="hasImage"><%= hasImage %></c:set>

<%-- initialize the list --%>
<cq:include script="list_init.jsp"/>

<ion-view view-title="<%= xssAPI.encodeForHTML(currentPage.getTitle()) %>">
    <ion-content>

<cq:include path="product-listing" resourceType="we-retail-client-app/components/structure/products/product-listing" />

<c:choose>
    <c:when test="${empty listPageList.pages}">
        <c:if test="${wcmMode}">
            <div class="list-placeholder">
                Create child pages or use the Page Properties dialog to include pages in this list.
            </div>
        </c:if>
    </c:when>
    <c:otherwise>
        <%-- div.articles will contain each individual article list fragment --%>
        <div class="articles list">
            <c:if test="${hasImage}">
                <div class="product-category-header-image" style="background-image: url(<%= xssAPI.getValidHref(imageSrc) %>);"/>
            </c:if>
<%

    List listPageList = (List)request.getAttribute("listPageList");
    Iterator<Page> items = listPageList.getPages();
    while (items.hasNext()) {
        Page readerPage = items.next();
        if (readerPage.getProperties().get("hideInReaderNav", false) == true) {
            continue;
        }
        // Prevent wrapping of included content
        IncludeOptions opts = IncludeOptions.getOptions(request, true);
        opts.setDecorationTagName("");
        opts.forceSameContext(Boolean.TRUE);
%>
            <cq:include resourceType="<%= readerPage.getContentResource().getResourceType() %>" path="<%= readerPage.getPath() + ".list_fragment.html" %>"/>
<%
    }
%>
        </div>
    </c:otherwise>
</c:choose>

    </ion-content>
</ion-view>