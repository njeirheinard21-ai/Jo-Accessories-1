import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '../../../core/services/ProductService';
import { FirebaseProductRepository } from '../../../infrastructure/firebase/FirebaseProductRepository';

// For DI, usually this comes from a container or context
const productRepository = new FirebaseProductRepository();
const productService = new ProductService(productRepository);

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAllProducts(),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => productService.createNewProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
