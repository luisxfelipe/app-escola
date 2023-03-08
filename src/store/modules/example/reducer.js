import * as types from "../types";

// eslint-disable-next-line no-unused-vars
const initialState = {
  botaoClicado: false,
};

// eslint-disable-next-line default-param-last, func-names
export default function (state = initialState, action) {
  switch (action.type) {
    case types.BOTAO_CLICADO_SUCCESS: {
      // eslint-disable-next-line no-console
      console.log("Sucesso");
      const newState = { ...state };
      newState.botaoClicado = !newState.botaoClicado;
      return newState;
    }

    case types.BOTAO_CLICADO_FAILURE: {
      // eslint-disable-next-line no-console
      console.log("Deu erro =(");
      return state;
    }

    case types.BOTAO_CLICADO_REQUEST: {
      // eslint-disable-next-line no-console
      console.log("Estou fazendo a requisição");
      return state;
    }

    default: {
      return state;
    }
  }
}
