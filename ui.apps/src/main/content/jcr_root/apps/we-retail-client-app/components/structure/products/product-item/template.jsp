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
%><%@include file="/libs/foundation/global.jsp" %><%
%><%@ page session="false"
           import="com.day.cq.i18n.I18n" %>
<cq:include script="overhead.jsp"/><%
    I18n i18n = new I18n(slingRequest);
%><%
%><div class="product-item-details" ng-controller="ProductDetailsController" ng-init="init()">
    <div class="bar">
        <h1 class="title">{{product.title}}</h1>
        <div class="bar bar-action">
            <button ng-class="{'ion-ios-star-outline': !isWishListItem, 'ion-ios-star wishListItem': isWishListItem}" class="ion-ios-star-outline icon button button-icon" ng-click="addProductToWishList(product)"></button>
            <span class="title">{{product.price}}</span>
            <button class="icon button button-icon ion-ios-information-outline" ng-click="openModal()" ng-hide="detailsOpen"></button>
        </div>
    </div>
    <ion-content class="has-subheader product-info">
        <img ng-src="{{product.imageSrc}}" alt="{{product.description}}" title="{{product.description}}">

        <div class="product-info-sku">
            Product \#{{product.SKU}}
        </div>

        <div class="stock">
            <div class="stock-status--wrapper-icon" ng-class="{'in-stock': product.availability > 0}">
                <span class="ion-ios-checkmark-empty"></span>
            </div>

            <dl class="stock-status--details-content-wrapper">
                <dt ng-if="store">{{product.availability}}</dt>
                <dd ng-if="store"> in stock</dd>
                <dt></dt>
                <dd ng-if="!store">Set your preferred <a ng-click="go('/content/mobileapps/we-retail/language-masters/en/tabs/more-items/store-locations', 'Locations', null, $event)">store</a></dd>
                <dd ng-if="store">Your store in {{store.name}} - <a ng-click="callStore()">{{store.phone}}</a></dd>
            </dl>
        </div>

        <div class="reviews">
            {{product.reviews}}
        </div>
    </ion-content>
</div>


<script id="product-item-modal.html" type="text/ng-template">
    <ion-modal-view class="modal-product-details" ng-click="closeModal()">
        <a class="modal-close button button-icon ion-ios-close-outline"></a>
        <ion-content>
            <div class="modal-product-details-description">
                <span class="title"><%=i18n.get("DESCRIPTION")%></span>
                {{product.summary}}
            </div>
        </ion-content>
    </ion-modal-view>
</script>