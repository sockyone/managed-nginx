# Nginx Openresty

## MYSQL

```
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-release bitnami/mysql
```

** Please be patient while the chart is being deployed **

Tip:

  Watch the deployment status using the command: kubectl get pods -w --namespace default

Services:

  echo Primary: openresty-mysql-primary.default.svc.cluster.local:3306
  echo Secondary: openresty-mysql-secondary.default.svc.cluster.local:3306

Administrator credentials:

  echo Username: root
  echo Password : $(kubectl get secret --namespace default openresty-mysql -o jsonpath="{.data.mysql-root-password}" | base64 --decode)

To connect to your database:

  1. Run a pod that you can use as a client:

      kubectl run openresty-mysql-client --rm --tty -i --restart='Never' --image  docker.io/bitnami/mysql:8.0.22-debian-10-r44 --namespace default --command -- bash

  2. To connect to primary service (read/write):

      mysql -h openresty-mysql-primary.default.svc.cluster.local -uroot -p merchize_routing

  3. To connect to secondary service (read-only):

      mysql -h openresty-mysql-secondary.default.svc.cluster.local -uroot -p merchize_routing

To upgrade this helm chart:

  1. Obtain the password as described on the 'Administrator credentials' section and set the 'root.password' parameter as shown below:

      ROOT_PASSWORD=$(kubectl get secret --namespace default openresty-mysql} -o jsonpath="{.data.mysql-root-password}" | base64 --decode)
      helm upgrade openresty-mysql bitnami/mysql --set auth.rootPassword=$ROOT_PASSWORD