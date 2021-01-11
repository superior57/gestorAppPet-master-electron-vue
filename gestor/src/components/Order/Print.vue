<template>
  <v-container fluid style="padding: 0">
    <iframe ref="frame" :src="src" :style="`width: 100%; height: calc(100vh - 245px); border-radius: 5px`" />
  </v-container>
</template>
 
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      src: undefined,
      headers: ["Qtde", "Item", { text: "Preço", alignment: 'right' }],
    };
  },

  computed: mapGetters(["company", "order"]),

  methods: {
    ...mapActions(["customPrint"]),

    prepare() {
      return new Promise(Response => {
        let body = this.order.items.map(item => [
          { text: item.quantity, alignment: 'right' },
          item.description,
          { text: this.$func.format.Money(item.price), alignment: 'right' }
        ]);

        let definitions = {
          pageSize: {
            width: 219.212598425,
            height: 'auto'
          },
          
          header: [ 
            { canvas: [{ type: 'line', x1: 5, y1: 5, x2: 214.212598425, y2: 5, lineWidth: 1, dash: {length: 2, space: 1} }] },
            { text: this.company.name, margin: 5 },
          ],

          content: [
            { text: `Pedido: ${this.order.id} Data: ${this.$func.format.DateHour(this.order.createdAt, '-0500')}`, margin: [-35, -15, -35, 0] },
            { text: `Entrega prevista: ${this.$func.format.Hour(this.order.createdAt, '-0500')}`, margin: [-35, 0, -35, 5] },

            { text: 'Dados do cliente', margin: [-35, 0] },
            { text: `Nome: ${this.order.user.name}`, margin: [-35, 0] },
            { text: `Telefone: ${this.order.user.phone}`, margin: [-35, 0] },
            // { text: 'Número de pedidos:', margin: [-35, 0] },
            { text: `Enderço: ${this.order.adress.adress }, ${ this.order.adress.number}`, margin: [-35, 0] },
            { text: `Comp: ${this.order.adress.complement}`, margin: [-35, 0] },
            { text: `Ref: ${this.order.adress.reference}`, margin: [-35, 0] },
            { text: `Cidade: ${this.order.adress.city} - ${this.order.adress.state}`, margin: [-35, 0] },
            { text: `CEP: ${this.order.adress.postal_code}`, margin: [-35, 0] },

            { text: 'Itens do pedido ', margin: [-35, 5, -35, 0] },
            {
              margin: [-35, 0],
              layout: "noBorders",
              table: {
                headerRows: 1,
                widths: [20, "*", 40],
                body: [this.headers, ...body]
              }
            },
        
            { canvas: [{ type: 'line', x1: -35, y1: 0, x2: 175, y2: 0, lineWidth: 1, dash: {length: 2, space: 1} }] },
        
            {
              columns: [
                { text: 'Subtotal: ', margin: [-35, 5, -35, 0] },
                { text: this.$func.format.Money(this.order.subtotal), alignment: 'right', margin: [-35, 5, -35, 0] },
              ]
            },
            
            {
              columns: [
                { text: 'Taxa de entrega: ', margin: [-35, 0] },
                { text: this.$func.format.Money(this.order.delivery_fee), alignment: 'right', margin: [-35, 0] },
              ]
            },
            
            {
              columns: [
                { text: 'Desconto cupom: ', margin: [-35, 0] },
                { text: this.$func.format.Money(this.order.discount), alignment: 'right', margin: [-35, 0] },
              ]
            },
        
            { canvas: [{ type: 'line', x1: -35, y1: 5, x2: 175, y2: 5, lineWidth: 1, dash: {length: 2, space: 1} }] },
            
            {
              columns: [
                { text: 'Cobrar do cliente: ', margin: [-35, 5, -35, 0] },
                { text: this.$func.format.Money(this.order.amount), alignment: 'right', margin: [-35, 5, -35, 0] },
              ]
            },
        
            { canvas: [{ type: 'line', x1: -35, y1: 5, x2: 175, y2: 5, lineWidth: 1, dash: {length: 2, space: 1} }] },
            
            { text: `Forma de pagamento: ${this.order.form_of_payment}`, margin: [-35, 5, -35, 0] },
          ],
	
          defaultStyle: {
            fontSize: 8
          }
        };

        Response(definitions);
      });
    },
  },

  async mounted() {
    let definitions = await this.prepare();
    this.src = (await this.customPrint(definitions)).data
  }
};
</script>

<style scoped>
html {
  width: 10px;
}
</style>
