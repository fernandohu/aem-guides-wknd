<%--
  ADOBE CONFIDENTIAL
  __________________

   Copyright 2012 Adobe Systems Incorporated
   All Rights Reserved.

  NOTICE:  All information contained herein is, and remains
  the property of Adobe Systems Incorporated and its suppliers,
  if any.  The intellectual and technical concepts contained
  herein are proprietary to Adobe Systems Incorporated and its
  suppliers and are protected by trade secret or copyright law.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe Systems Incorporated.
--%><%
%><%@include file="/libs/foundation/global.jsp" %><%
%><%@ page session="false"
           import="com.adobe.cq.media.publishing.dps.DPSArticle,
           org.apache.commons.lang.StringUtils" %>
<%
DPSArticle article = currentPage.adaptTo(DPSArticle.class);
String kickerXSS = (article != null) ? xssAPI.filterHTML(article.getKicker()) : null;
%>
<div class="header" data-dps-container="flowed">
    <div class="article-category"><%
        if (StringUtils.isNotEmpty(kickerXSS)) {
           %><div><span><%= kickerXSS %></span></div><%
        }%>
    </div>
    <div class="category-trim">&nbsp;</div>
    <cq:include path="article-image" resourceType="foundation/components/image"/>
    <div class="title-and-author">
        <cq:include path="article-title" resourceType="we-unlimited-app/components/title"/>
    </div>
</div>