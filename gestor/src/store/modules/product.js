import Vue from "vue";
import { getResponse, getParams, putResponse } from "../utils";

export default {
  actions: {
    async productByEan(context, filters) {
      return await getResponse(`scrapping?${getParams(filters)}`);
    },

    async getProducts(context, options) {
      return await getResponse(`gestor/products?${getParams(options)}}`);
    },

    async saveProduct(context, product) {
      const saveImage = async function () {
        const formData = new FormData();
        formData.append("image", product.imageData, product.imageData.name);
        return await Vue.http.put(
          "product/photo/" + product.id + "/" + product.company_id,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      };

      let response;

      if (product.id === void 0) {
        product.company_id = context.getters.company.id;
        response = await putResponse("product", product);

        if (response.error) throw response.error;

        product.id = response.data.id;
      } else {
        response = await putResponse("product", product);
      }

      if (product.imageData) {
        const image = await saveImage();

        if (image.error) throw image.error;

        product.image = image ? image.body.imageUrl : void 0;
      }

      return response;
    },
  },
};
