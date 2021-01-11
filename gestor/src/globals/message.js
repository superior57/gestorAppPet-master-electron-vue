export default {
  methods: {
    message(msg, options = { icon: 'info', title: "Informação" }) {
      const { icon, title } = options
      this.$swal(title, msg, { icon });
    },

    error(msg, title = "Erro") {
      this.$swal({
        className: "message-dialog",
        content: {
          element: "p",
          attributes: {
            innerHTML: `
                            <span style="font-size: 30px; color: white">${title}</span>
                            <br>
                            <br>
                            <span style="color: white">${msg}</span>
                        `
          }
        },
        icon: "error",
        dangerMode: true,
        closeOnClickOutside: true
      });
    },

    confirm(msg, options = {
      icon: 'warning',
      title: 'Atenção',
      buttons: ['Cancelar', 'Confirmar']
    }) {
      const { icon, title, buttons } = options
      return new Promise(resolve => {
        this.$swal({
          className: "message-dialog",
          content: {
            element: "p",
            attributes: {
              innerHTML: `
                            <span style="font-size: 30px; color: white">${title}</span>
                            <br>
                            <br>
                            <span style="color: white">${msg}</span>
                        `
            }
          },
          icon,
          buttons,
          dangerMode: true,
          closeOnClickOutside: false
        }).then(confirmation => { resolve(confirmation) });
      })
    }
  }
}