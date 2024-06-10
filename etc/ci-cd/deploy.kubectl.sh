#!/bin/bash

cd $1 || exit

loadenv() {
  if test -f $1; then
    set -o allexport
    # shellcheck disable=SC2039
    source $1
    set +o allexport
  fi
}

#load k8s variables if exist
loadenv "./etc/kubernetes/.env.k8s"

#load env variables
loadenv ".env"

if [ -z "$BUILD_ENV" ]; then
  # shellcheck disable=SC2039
  read -rp "SPECIFY THE BUILD ENVIRONMENT: " BUILD_ENV
fi

echo "deploying env: $BUILD_ENV"

grep -rl localhost:32000/image:latest ./etc/kubernetes/ci-cd | xargs sed -i "s,localhost:32000/image:latest,${CONTAINER_IMAGE},"
grep -rl ${CONTAINER_REGISTRY} ./etc/kubernetes/ci-cd | xargs sed -i "s,${CONTAINER_REGISTRY},localhost:32000,"
grep -rl {BUILD_ENV} ./etc/kubernetes/ci-cd | xargs sed -i "s,{BUILD_ENV},${BUILD_ENV},"
grep -rl {KUB_HOSTNAME} ./etc/kubernetes/ci-cd | xargs sed -i "s,{KUB_HOSTNAME},${KUB_HOSTNAME},"
grep -rl {KUB_NAMESPACE_PREFIX} ./etc/kubernetes/ci-cd | xargs sed -i "s,{KUB_NAMESPACE_PREFIX},${KUB_NAMESPACE_PREFIX},"
grep -rl {KUB_SERVICE_NAME} ./etc/kubernetes/ci-cd | xargs sed -i "s,{KUB_SERVICE_NAME},${KUB_SERVICE_NAME},"

#kubectl delete namespace ${REBUILD_ENV_NAMESPACE}
kubectl apply -f "./etc/kubernetes/ci-cd/namespace.yml"

SECRET_NAME="${KUB_SERVICE_NAME}-secrets"
KUB_NAMESPACE="${KUB_NAMESPACE_PREFIX}-${BUILD_ENV}"
kubectl delete --namespace ${KUB_NAMESPACE} --ignore-not-found secret $SECRET_NAME
kubectl create secret generic $SECRET_NAME --namespace ${KUB_NAMESPACE} --from-env-file=.env

kubectl apply \
    -f "./etc/kubernetes/ci-cd/deployment.yml" \
    -f "./etc/kubernetes/ci-cd/service.yml" \
    -f "./etc/kubernetes/ci-cd/ingress.yml"

