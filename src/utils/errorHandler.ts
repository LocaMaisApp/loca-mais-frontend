
export const handleApiError = (error: unknown, defaultMessage: string = "Erro desconhecido"): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as { 
      response: { 
        data: { message?: string } 
      } 
    };
    
    return apiError.response?.data?.message || defaultMessage;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return defaultMessage;
};
