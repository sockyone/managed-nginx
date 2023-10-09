helm repo add bitnami https://charts.bitnami.com/bitnami

helm install redis bitnami/redis -n redis --values=redis/values.yml

kubectl run --namespace redis redis-redis-cluster-client --rm --tty -i --restart='Never' --image docker.io/bitnami/redis-cluster:6.0.9-debian-10-r36 -- bash
redis-cli -c -h redis-redis-cluster