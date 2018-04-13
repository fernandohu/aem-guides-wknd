/*
 * Copyright 2016 Adobe Systems Incorporated
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package apps.we_retail_screens.components.product;

import java.io.StringWriter;
import java.util.Iterator;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.io.JSONWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.commerce.api.CommerceException;
import com.adobe.cq.commerce.api.CommerceService;
import com.adobe.cq.commerce.api.CommerceSession;
import com.adobe.cq.commerce.api.Product;
import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.commons.ImageResource;

public class ScreensProduct extends WCMUsePojo {

    /**
     * default logger
     */
    private static final Logger log = LoggerFactory.getLogger(ScreensProduct.class);

    @Override
    public void activate() throws Exception {
    }

    public String getJSON() throws JSONException, CommerceException {
        StringWriter out = new StringWriter();
        JSONWriter w = new JSONWriter(out);
        Resource productResource = getCurrentPage().getContentResource("product");
        Product product = productResource == null ? null : productResource.adaptTo(Product.class);
        w.object();
        if (product != null) {
            ImageResource img = product.getImage();
            w.key("title").value(product.getTitle());
            w.key("description").value(product.getDescription());
            w.key("productPath").value(product.getPIMProduct().getPath());
            w.key("path").value(getCurrentPage().getPath());
            w.key("summary").value(product.getProperty("summary", String.class));
            w.key("features").value(product.getProperty("features", String.class));
            w.key("price").value(product.getProperty("price", Double.class));
            w.key("imageHref").value(img.getHref());
            w.key("variantAxes").array();
            String[] variantAxes = product.getProperty("cq:productVariantAxes", String[].class);
            if (variantAxes != null) {
                for (String variantAxe : variantAxes) {
                    w.value(variantAxe);
                }
            }
            w.endArray();
            w.key("variants").array();
            Iterator<Product> variantsIterator = product.getVariants();
            Iterator<String> variantAxesIterator;
            Product variant;
            String variantAxis;
            while (variantsIterator.hasNext()) {
                variant = variantsIterator.next();
                w.object();
                variantAxesIterator = product.getVariantAxes();
                while (variantAxesIterator.hasNext()) {
                    img = variant.getImage();
                    if (img != null) {
                        w.key("imageHref").value(img.getHref());
                    }
                    variantAxis = variantAxesIterator.next();
                    w.key("title").value(variant.getTitle());
                    w.key("path").value(variant.getPath());
                    w.key("basePath").value(getCurrentPage().getPath());
                    w.key(variantAxis).value(variant.getProperty(variantAxis, String.class));
                }
                w.endObject();
            }
            w.endArray();
        }
        w.endObject();
        return out.toString();
    }

}
