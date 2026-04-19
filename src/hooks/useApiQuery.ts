import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export function useApiQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, Error>({
    queryKey,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error: any) {
        console.error(`[API Error] ${queryKey.join('/')}:`, error);
        // Toast is imported lazily to avoid circular deps
        try {
          const { toast } = await import('./useToast');
          toast.error(`Erreur réseau: ${error.message || 'Connexion serveur impossible'}`, 'Erreur API');
        } catch (_) { /* silent */ }
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000,
    ...options,
  });
}
