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
           import="com.adobe.cq.commerce.api.Product,
                   com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils,
                   org.apache.sling.api.resource.Resource" %><%
%><%@include file="/libs/foundation/global.jsp"%><%
%><%@include file="/apps/we-retail-client-app/global.jsp"%><%

    // Get the product this page represents
    Resource currentPageResource = currentPage.adaptTo(Resource.class);
    String productPrice = "n/a";
    String summary = "";
    String title = "no title";
    String description = "";
    String sku = "";
    String author = "no author";
    String imageSrc = "";
    String availability = "";
    Product product = getProduct(currentPageResource);
    String reviews = "";

    if (product != null) {
        title = product.getTitle();
        description = product.getDescription();
        sku = product.getSKU();
        productPrice = getProductPrice(product, currentPageResource, slingRequest, slingResponse);
        author = product.getProperty("author", String.class);
        summary = product.getProperty("summary", String.class);
        availability = product.getProperty("inventory", String.class);
        reviews = product.getProperty("reviews", String.class);
    }
    request.setAttribute("productPrice", productPrice);

    Resource imageResource = currentPage.getContentResource().getChild("image");
    if (imageResource != null) {
        Resource topLevelAppResource = FrameworkContentExporterUtils.getTopLevelAppResource(currentPage.adaptTo(Resource.class));
        boolean appExport = Boolean.parseBoolean(slingRequest.getParameter("appExport"));
        imageSrc = currentPage.getPath() + ".img.png";
        imageSrc = FrameworkContentExporterUtils.getPathToAsset(topLevelAppResource, imageSrc, appExport);
    }

%>
{
    items: 
    [
        {
            'title': '<%= xssAPI.encodeForJSString(title) %>',
            'author': '<%= xssAPI.encodeForJSString(author) %>',
            'description': '<%= xssAPI.encodeForJSString(description) %>',
            'price': '<%= xssAPI.encodeForJSString(productPrice) %>',
            'SKU': '<%= xssAPI.encodeForJSString(sku) %>',
            'imageSrc': '<%= xssAPI.encodeForJSString(imageSrc) %>',
            'numberOfLikes': '0',
            'numberOfComments': '0',
            'summary': '<%= xssAPI.encodeForJSString(summary) %>',
            'availability': '<%= xssAPI.encodeForJSString(availability) %>',
            'reviews': '<%= xssAPI.encodeForJSString(reviews) %>'
        }
    ]
}