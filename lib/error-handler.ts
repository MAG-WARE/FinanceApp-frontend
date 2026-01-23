import { AxiosError } from "axios";

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: string;
}

/**
 * Formata erros de API para mensagens amigáveis e detalhadas
 */
export function formatApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status;
    const serverMessage = error.response?.data?.message || error.response?.data?.error;
    const details = error.response?.data?.details;

    // Mensagens específicas por código de status
    switch (statusCode) {
      case 400:
        const errors = error.response?.data?.errors;
        let errorDetails = details;
        if (errors) {
          if (Array.isArray(errors)) {
            errorDetails = errors.join(", ");
          } else if (typeof errors === "object") {
            errorDetails = Object.values(errors).flat().join(", ");
          }
        }
        return {
          message: serverMessage || "Dados inválidos enviados ao servidor",
          statusCode,
          details: errorDetails,
        };

      case 401:
        return {
          message: "Não autorizado. Faça login novamente",
          statusCode,
        };

      case 403:
        return {
          message: "Você não tem permissão para realizar esta ação",
          statusCode,
        };

      case 404:
        return {
          message: "Recurso não encontrado no servidor (404)",
          statusCode,
          details: serverMessage || "A rota da API não existe ou o backend não está rodando",
        };

      case 409:
        return {
          message: serverMessage || "Conflito com dados existentes",
          statusCode,
          details,
        };

      case 422:
        return {
          message: "Erro de validação",
          statusCode,
          details: details || serverMessage,
        };

      case 500:
        return {
          message: "Erro interno do servidor",
          statusCode,
          details: serverMessage || "Contate o administrador do sistema",
        };

      case 502:
      case 503:
      case 504:
        return {
          message: "Servidor indisponível",
          statusCode,
          details: "O servidor está temporariamente indisponível. Tente novamente mais tarde",
        };

      default:
        return {
          message: serverMessage || `Erro na requisição (${statusCode || "sem código"})`,
          statusCode,
          details: details || error.message,
        };
    }
  }

  // Erro de rede (sem resposta do servidor)
  if (error instanceof Error) {
    if (error.message.includes("Network Error") || error.message.includes("ERR_CONNECTION")) {
      return {
        message: "Erro de conexão com o servidor",
        details: "Verifique se o backend está rodando e se a URL está correta",
      };
    }

    return {
      message: error.message || "Erro desconhecido",
    };
  }

  return {
    message: "Erro desconhecido ao processar a requisição",
  };
}

/**
 * Retorna uma descrição formatada do erro para exibir ao usuário
 */
export function getErrorDescription(error: ApiError): string {
  let description = error.message;

  if (error.statusCode) {
    description = `[${error.statusCode}] ${description}`;
  }

  if (error.details) {
    description += `\n${error.details}`;
  }

  return description;
}
