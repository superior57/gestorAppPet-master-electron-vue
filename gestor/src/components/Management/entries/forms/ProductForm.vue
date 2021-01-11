<template>
  <v-card tile :disabled="loading">
    <slot-entry
      title="Cadastro de Produto"
      :close="cancell"
      :post="post"
      :showProgress="loading"
      :button1Click="() => { dialog = true }"
      :button1Enabled="isVariation"
      button1Name="Variação"
    >
      <v-card style="overflow: auto; height: 483px">
        <v-form ref="form" v-model="valid">
          <v-container>
            <v-row>
              <v-col cols="4" md="2">
                <v-text-field dense label="Código de Barras" v-model="product.ean" required @blur="blurEan" />
              </v-col>

              <v-col cols="4" md="2">
                <v-text-field 
                  dense 
                  label="Quantidade em Estoque"
                  type="number" 
                  v-model="product.stock"
                  @blur="product.stock = product.stock ? parseFloat(product.stock).toFixed(2) : 0" 
                />
              </v-col>

              <v-col cols="4" md="2">
                <v-switch
                  dense
                  label="Destaque"
                  v-model="product.contrast"
                  color="color1"
                  style="margin-top: 0"
                />
              </v-col>

              <v-spacer />

              <v-col cols="4" md="2">
                <v-text-field dense label="Código ERP" v-model="product.id_erp" required />
              </v-col>
              <v-col cols="4" md="2">
                <v-select
                  dense
                  label="Prioridade exib."
                  v-model="product.priority"
                  :items="[1, 2, 3]"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="8" md="4">
                <v-text-field
                  dense
                  label="Descrição"
                  v-model="product.description"
                  :rules="[rules.required, rules.min5]"
                  required
                />
              </v-col>

              <v-col cols="4" md="2">
                <v-switch
                  dense
                  label="Ativo"
                  v-model="product.active"
                  color="color1"
                  true-value="S"
                  false-value="N"
                  style="margin-top: 0"
                />
              </v-col>

              <v-col cols="4" md="2">
                <v-text-field
                  dense
                  label="Valor"
                  prefix="R$"
                  type="number"
                  v-model="product.value"
                  :rules="isVariation ? []: [rules.required, rules.numberValidation]"
                  @blur="formatNumber()"
                  :required="!isVariation"
                  :disabled="isVariation"
                />
              </v-col>

              <v-col cols="4" md="2">
                <v-select
                  dense
                  label="Unid."
                  v-model="product.unity"
                  :items="['UN', 'PC', 'CX', 'PT']"
                  :rules="[rules.required]"
                  required
                />
              </v-col>

              <v-col cols="4" md="2">
                <v-switch
                  dense
                  label="Promoção"
                  v-model="product.promotion"
                  color="color1"
                  style="margin-top: 0"
                />
              </v-col>

              <v-col cols="3" md="3">
                <v-select
                  dense
                  label="Categoria"
                  v-model="product.category_id"
                  item-text="description"
                  item-value="id"
                  :items="categories"
                  :rules="[rules.required]"
                  required
                />
              </v-col>

              <v-col cols="3" md="3">
                <v-select
                  dense
                  label="Tipo de produto"
                  v-model="product.type"
                  :items="['Alimentos', 'Farmácia', 'Higiene', 'Acessórios']"
                  :rules="[rules.required]"
                  required
                />
              </v-col>

              <v-col cols="2" md="2">
                <v-switch
                  dense
                  label="Adulto"
                  v-model="product.adult"
                  color="color1"
                  style="margin-top: 0"
                  hide-details
                />
              </v-col>

              <v-col cols="2" md="2">
                <v-switch
                  dense
                  label="Filhote"
                  v-model="product.puppy"
                  color="color1"
                  style="margin-top: 0"
                  hide-details
                />
              </v-col>

              <v-col cols="2" md="2">
                <div>
                  <v-switch
                    dense
                    label="Preço variado"
                    v-model="isVariation"
                    color="color1"
                    style="margin-top: 0"
                    hide-details
                  />
                  <v-dialog v-if="dialog" v-model="dialog" persistent max-width="500px">
                    <price-variation :variations="computedVariations" :close="closeDialog" />
                  </v-dialog>
                </div>
              </v-col>

              <v-col cols="4" md="2">
                <div>
                  <v-switch
                    dense
                    label="Aves"
                    v-model="product.bird"
                    color="color1"
                    style="margin-top: 0"
                    hide-details
                  />
                  <v-switch
                    dense
                    label="Cães"
                    v-model="product.dog"
                    color="color1"
                    style="margin-top: 0"
                    hide-details
                  />
                  <v-switch
                    dense
                    label="Gatos"
                    v-model="product.cat"
                    color="color1"
                    style="margin-top: 0"
                    hide-details
                  />
                  <v-switch
                    dense
                    label="Peixes"
                    v-model="product.fish"
                    color="color1"
                    style="margin-top: 0"
                    hide-details
                  />
                  <v-switch
                    dense
                    label="Répteis"
                    v-model="product.reptile"
                    color="color1"
                    style="margin-top: 0"
                    hide-details
                  />
                  <v-switch
                    dense
                    label="Roedores"
                    v-model="product.rodent"
                    color="color1"
                    style="margin-top: 0"
                    hide-details
                  />
                  <v-switch
                    dense
                    label="Casa e Jardim"
                    v-model="product.garden"
                    color="color1"
                    style="margin-top: 0"
                    hide-details
                  />
                </div>
              </v-col>

              <v-col cols="6" md="4">
                <v-row align="center" justify="center">
                  <v-carousel 
                    v-if="!showImage && images.length > 0"
                    v-model="imageIndex"
                    height="200"
                  >
                    <v-carousel-item
                      v-for="img in images"
                      :key="img.src"
                    >
                      <v-row
                        class="fill-height"
                        align="center"
                        justify="center"
                      >
                        <v-img
                          :src="img.src"
                          contain
                          aspect-ratio="1"
                          max-width="200"
                          max-height="200"
                        />
                      </v-row>
                    </v-carousel-item>
                  </v-carousel>
                  <v-img
                    v-else-if="showImage"
                    :src="image"
                    contain
                    aspect-ratio="1"
                    max-width="200"
                    max-height="200"
                  />
                </v-row>
                <v-row align="center" justify="center">
                  <v-btn
                    style="margin-top: 10px"
                    color="color1"
                    @click="selectImage"
                    dark
                  >{{!product.image || product.image.trim() == '' ? 'ADICIONAR IMAGEM': 'ALTERAR IMAGEM'}}</v-btn>
                </v-row>
              </v-col>

              <v-col cols="12" md="6">
                <v-textarea
                  dense
                  counter="800"
                  v-model="product.observations"
                  :rules="[rules.required]"
                  label="Observações/Detalhes"
                  maxlength="800"
                  rows="11"
                  no-resize
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </slot-entry>
  </v-card>
</template>

<script>
import slotEntry from "../commons/SlotEntry.vue";
import priceVariation from "./PriceVariation.vue";
import { mapGetters, mapActions } from "vuex";
import Message from "@/globals/message";

export default {
  props: {
    product: Object,
    close: Function
  },
  components: {
    slotEntry,
    priceVariation
  },

  mixins: [Message],

  data() {
    return {
      valid: false,
      isVariation: false,
      dialog: false,
      categories: [],
      rules: {
        required: value => !!value || "Informação necessária",
        numberValidation: value =>
          this.valideFloat(value) || "O valor precisa ser maior que 0 (zero)",
        min5: value =>
          (value && value.length >= 5) ||
          "É necessário informar pelo menos 5 caracteres."
      },
      loading: false,
      showImage: false,
      imageData: undefined,
      image: undefined,
      images: [],
      imageIndex: -1
    };
  },
  watch: {
    isVariation: function(val) {
      if (val) {
        if (!this.product.variations || this.product.variations.length == 0) {
          this.dialog = true;
        }
      } else {
        this.product.variations = undefined;
      }
    },
    dialog: function(val) {
      if (!val) {
        if (this.product.variations && this.product.variations.length > 0) {
          this.product.value = 0;
        } else {
          this.isVariation = false;
        }
      }
    }
  },

  computed: {
    ...mapGetters(["company"]),
    computedVariations: {
      get() {
        let variations = this.product.variations;
        return variations
          ? variations.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
          : [];
      },

      set(val) {
        this.product.variations = val.sort((a, b) =>
          a.value > b.value ? 1 : a.value < b.value ? -1 : 0
        );
      }
    }
  },

  methods: {
    ...mapActions(["saveProduct", "getCategories", "getVariations", "productByEan"]),

    closeDialog(items) {
      if (items && items.length > 0) {
        this.product.variations = items;
      }
      this.dialog = false;
      if (this.product.variations && this.product.variations.length > 0) {
        this.product.value = 0;
      } else {
        this.isVariation = false;
      }
    },

    selectImage() {
      this.$func.selectFile(".png, .jpg, .jpeg", false).then(result => {
        this.imageData = result;
        this.showImage = false;
        this.image = window.URL.createObjectURL(result);
        this.images = [];
        this.imageIndex = -1;
        this.showImage = true;
      });
    },

    formatNumber() {
      if (this.product.value)
        this.product.value = parseFloat(this.product.value).toFixed(2);
    },

    valideFloat(value) {
      if (!value) return false;
      else {
        let isString = isNaN(value);
        if (isString) return isString;
        else return parseFloat(value) > 0;
      }
    },

    async updateProductAddon() {
      this.$refs.form.resetValidation();
      if (this.product.value)
        this.product.value = parseFloat(this.product.value).toFixed(2);
      else this.product.value = "0.00";
      if (this.product.stock)
        this.product.stock = parseFloat(this.product.stock).toFixed(2);
      else this.product.stock = "0.00";
      if (!this.product.active) this.product.active = "S";
      this.showImage = false;
      this.showImage = this.product.image && this.product.image.trim() != "";
      this.image = this.product.image;

      this.isVariation = this.product.variation == "S";
      this.loading = false;
    },

    cancell() {
      this.isVariation = false; //pra não abrir o dialog de variação
      this.close();
    },

    async post() {
      if (this.$refs.form.validate()) {
        if ((this.imageIndex >= 0) && (this.images.length > 0))
          this.product.image = this.images[this.imageIndex].src;

        this.product.variation = this.isVariation ? "S" : "N";
        this.product.imageData = this.imageData;
        this.loading = true;

        await this.saveProduct(this.product);

        this.loading = false;
        this.close(this.product);
      }
    },

    async blurEan() {
      try {
        this.loading = true;
        
        if (!this.product.ean || this.product.ean.length < 8 || this.product.ean.length > 13) 
          return
  
        const res = await this.productByEan({ ean: this.product.ean })
        
        if (res.error) {
          if (res.message)
            console.error(res.message);
          return
        }
  
        const product = res.data;

        if (product.company_id) {
          const productOld = this.product
         
          this.product = product;

          this.product.id = productOld.id;
          this.product.company_id = productOld.company_id;
          this.product.id_erp = productOld.id_erp;
          this.product.value = productOld.value;
          this.product.promotion = productOld.promotion;
          this.product.category_id = productOld.category_id;
          this.product.active = productOld.active;
          this.product.stock = productOld.stock;

          this.updateProductAddon();
          return
        }

        const images = res.images;
        
        this.images = [];
        this.product.description = product.Title.trim().substring(0, 255);
        this.product.observations = product.Description.trim().substring(0, 800);

        if (images.ImagesPerSource){
          let sources = Object.keys(images.ImagesPerSource);

          if (!sources) return
          
          sources.forEach(sourceKey => {
            let source = images.ImagesPerSource[sourceKey]
            let image = { width: 0, height: 0, src: '' };
  
            if (source.ImageURL) {
              this.product.image = source.ImageURL;
              this.updateProductAddon();
            } else {
              let keys = Object.keys(source.ImagesDetailsHistory);
              
              if (!keys) return
  
              const histories = source.ImagesDetailsHistory[keys[keys.length -1]];
  
              if (!histories) return
  
              histories.forEach(history => {
                let img = new Image();
  
                const self = this;
  
                img.onload = function() {
                  if ((this.width > image.width) && (this.height > image.width) && (self.images.length < 4)) {
                    if (self.images.indexOf(image)) {
                      self.images.push(image);
                      self.images.sort((old, val) => (val.width > old.width) && (val.height > old.height));
                      self.imageIndex = 0;
                      self.showImage = false
                    }

                    image.width = this.width;
                    image.height = this.height;
                    image.src = this.src
                  }
                }

                img.src = history.ImageUrl;
              });
            }       
          });
        }
      } finally {
        this.loading = false;
      }      
    }
  },
  async created() {
    this.categories = (await this.getCategories(this.company.id)).data;
    this.updateProductAddon();
  },
  mounted() {
    this.images = [];
    this.loading = true;
    if (this.categories) this.updateProductAddon();
  }
};
</script>