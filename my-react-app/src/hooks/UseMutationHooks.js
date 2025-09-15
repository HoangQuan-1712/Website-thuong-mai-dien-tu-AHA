import { useMutation } from '@tanstack/react-query'

export const UseMutatonHooks = (fnCallBack) => {
    const mutation = useMutation({
        mutationFn: (data) => fnCallBack(data)
    })
    return mutation
}