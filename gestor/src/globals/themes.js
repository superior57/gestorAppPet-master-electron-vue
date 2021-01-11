import colors from 'vuetify/lib/util/colors'

export const themes = {
    grey: {
        name: 'Cinza',
        light: {
            color1: colors.grey.darken4,
            color1_highlight: colors.grey.darken1,
        },
        dark: {
            color1: colors.grey.darken1,
            color1_highlight: colors.grey.lighten1,
        }
    },
    blueGrey: {
        name: 'Azul acinzentado',
        light: {
            color1: colors.blueGrey.darken2,
            color1_highlight: colors.blueGrey.darken4,
        },
        dark: {
            color1: colors.blueGrey.lighten1,
            color1_highlight: colors.blueGrey.lighten5,
        }
    },
    brown: {
        name: 'Marrom',
        light: {
            color1: colors.brown.darken2,
            color1_highlight: colors.brown.darken4,
        },
        dark: {
            color1: colors.brown.lighten2,
            color1_highlight: colors.brown.lighten4,
        }
    },
    deepOrange: {
        name: 'Laranja profundo',
        light: {
            color1: colors.deepOrange.darken2,
            color1_highlight: colors.deepOrange.darken4,
        },
        dark: {
            color1: colors.deepOrange.lighten2,
            color1_highlight: colors.deepOrange.lighten4,
        }
    },
    orange: {
        name: 'Laranja',
        light: {
            color1: colors.orange.darken3,
            color1_highlight: colors.orange.darken1,
        },
        dark: {
            color1: colors.orange.darken1,
            color1_highlight: colors.orange.lighten2,
        }
    },
    amber: {
        name: 'Âmbar',
        light: {
            color1: colors.amber.accent4,
            color1_highlight: colors.amber.darken4,
        },
        dark: {
            color1: colors.amber.darken4,
            color1_highlight: colors.amber.darken1,
        }
    },
    yellow: {
        name: 'Amarelo',
        light: {
            color1: colors.yellow.darken3,
            color1_highlight: colors.yellow.accent4,
        },
        dark: {
            color1: colors.yellow.darken3,
            color1_highlight: colors.yellow.darken1,
        }
    },
    lime: {
        name: 'Lima',
        light: {
            color1: colors.lime.darken2,
            color1_highlight: colors.lime.accent4,
        },
        dark: {
            color1: colors.lime.darken2,
            color1_highlight: colors.lime.accent4,
        }
    },
    lightGreen: {
        name: 'Verde claro',
        light: {
            color1: colors.lightGreen.accent4,
            color1_highlight: colors.lightGreen.darken4,
        },
        dark: {
            color1: colors.lightGreen.accent4,
            color1_highlight: colors.lightGreen.darken4,
        }
    },
    green: {
        name: 'Verde',
        light: {
            color1: colors.green.accent4,
            color1_highlight: colors.green.darken4,
        },
        dark: {
            color1: colors.green.darken4,
            color1_highlight: colors.green.lighten1,
        }
    },
    teal: {
        name: 'Cerceta',
        light: {
            color1: colors.teal.accent4,
            color1_highlight: colors.teal.darken4,
        },
        dark: {
            color1: colors.teal.darken2,
            color1_highlight: colors.teal.lighten2,
        }
    },
    cyan: {
        name: 'Ciano',
        light: {
            color1: colors.cyan.darken1,
            color1_highlight: colors.cyan.darken4,
        },
        dark: {
            color1: colors.cyan.darken3,
            color1_highlight: colors.cyan.lighten5,
        }
    },
    lightBlue: {
        name: 'Azul claro',
        light: {
            color1: colors.lightBlue.darken1,
            color1_highlight: colors.lightBlue.darken4,
        },
        dark: {
            color1: colors.lightBlue.darken3,
            color1_highlight: colors.lightBlue.lighten5,
        }
    },
    blue: {
        name: 'Azul',
        light: {
            color1: colors.blue.darken1,
            color1_highlight: colors.blue.darken4,
        },
        dark: {
            color1: colors.blue.darken3,
            color1_highlight: colors.blue.lighten5,
        }
    },
    indigo: {
        name: 'Índigo',
        light: {
            color1: colors.indigo.darken1,
            color1_highlight: colors.indigo.darken4,
        },
        dark: {
            color1: colors.indigo.darken3,
            color1_highlight: colors.indigo.lighten5,
        }
    },
    deepPurple: {
        name: 'Roxo profundo',
        light: {
            color1: colors.deepPurple.darken1,
            color1_highlight: colors.deepPurple.darken4,
        },
        dark: {
            color1: colors.deepPurple.darken3,
            color1_highlight: colors.deepPurple.lighten5,
        }
    },
    purple: {
        name: 'Roxo',
        light: {
            color1: colors.purple.darken1,
            color1_highlight: colors.purple.darken4,
        },
        dark: {
            color1: colors.purple.darken3,
            color1_highlight: colors.purple.lighten5,
        }
    },
    pink: {
        name: 'Rosa',
        light: {
            color1: colors.pink.darken1,
            color1_highlight: colors.pink.darken4,
        },
        dark: {
            color1: colors.pink.darken3,
            color1_highlight: colors.pink.lighten5,
        }
    },
    red: {
        name: 'Vermelho',
        light: {
            color1: colors.red.darken1,
            color1_highlight: colors.red.darken4,
        },
        dark: {
            color1: colors.red.darken3,
            color1_highlight: colors.red.lighten5,
        }
    }
}

export const activeTheme = themes.cyan