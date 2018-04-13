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
           import="com.day.cq.tagging.Tag,
                   com.day.cq.tagging.TagManager,
                   com.adobe.cq.commerce.api.Product,
                   com.day.cq.commons.RangeIterator,
                   com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils,
                   com.day.cq.wcm.foundation.Image,
                   org.apache.sling.api.resource.Resource"%><%
%><%@include file="/libs/foundation/global.jsp"%><%
%><%@include file="/apps/we-retail-client-app/global.jsp"%><%

%>
<%
    final String TEMPLATE_PAGE_RESOURCE_TYPE = "we-retail-client-app/components/structure/products/product-template-page";
    final String PRODUCT_DATA_ROOT_PAGE = "catalogs/product-data";

    boolean hasAChildPage = currentPage.listChildren().hasNext();
    boolean hasImage = false;
    String imageSrc = null;

    // Don't show any products if this page is not a leaf
    if (hasAChildPage == false ) {

        Tag[] tags = currentPage.getTags();
        String dataRootPath = FrameworkContentExporterUtils.getTopLevelAppResource(currentPage.getContentResource()).getPath() + "/" + PRODUCT_DATA_ROOT_PAGE;

        if (tags.length > 0) {

            // Convert tags array to an array of String paths
            String[] tagsIds = new String[tags.length];
            for (int i = 0; i < tags.length; i++) {
                tagsIds[i] = tags[i].getPath();
            }
    
            TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
    
            RangeIterator<Resource> taggedPages = tagManager.find(dataRootPath, tagsIds);

            while(taggedPages.hasNext()){

                Resource productPageResource = taggedPages.next();
                // Get the product represented by this page
                Product product = getProduct(productPageResource);

                if (product != null) {
                    // Determine the product path
                    Resource productPageTemplateResource = FrameworkContentExporterUtils.getAncestorTemplateResource(productPageResource, TEMPLATE_PAGE_RESOURCE_TYPE);
                    String productSKUPrefix = product.getSKU().substring(0,2);
                    String templatePath = productPageTemplateResource.getPath();

                    // Get the product image
                    Resource imageResource = productPageResource.getChild("image");
                    if (imageResource != null) {
                        Image pageImage = new Image(imageResource);
                        if (pageImage != null && pageImage.hasContent()) {
                            hasImage = true;
                            Resource topLevelAppResource = FrameworkContentExporterUtils.getTopLevelAppResource(productPageResource);
                            boolean appExport = Boolean.parseBoolean(slingRequest.getParameter("appExport"));
                            imageSrc = FrameworkContentExporterUtils.getPathToAsset(topLevelAppResource, productPageResource.getParent().getPath() + ".img.png", appExport);
                        }
                    }

                %><c:set var="hasImage"><%= hasImage %></c:set>
                    <a class="item item-thumbnail-left" ng-click="goProduct('<%= request.getContextPath() %><%= xssAPI.getValidHref(templatePath) %>', '<%= xssAPI.getValidHref(productSKUPrefix) %>', '<%= xssAPI.getValidHref(productPageResource.getParent().getName()) %>')">

                        <c:if test="${hasImage}">
                           <img style="height: auto; width: auto" src="<%= xssAPI.getValidHref(imageSrc) %>"/>
                        </c:if>

                        <div class="product-listing-title" >
                            <%= xssAPI.encodeForHTML(product.getTitle()) %>
                        </div>

                    </a>
                <%
                }
            }
        }
    }
%>
