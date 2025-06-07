Certainly! Below is a clean and production-style documentation section in **English** for setting up **NGINX Ingress Controller with NodePort**, suitable for **testing traffic** on a Kubernetes cluster (like the one you installed via Kubespray).

---

# 🌐 Deploying NGINX Ingress Controller (NodePort) for Traffic Testing

This guide installs the **NGINX Ingress Controller** using **Helm**, configured to expose HTTP and HTTPS traffic via **NodePort** services.

---

## 📋 Requirements

* Kubernetes cluster is already running and reachable.
* Helm is installed on your control machine (`helm version`).
* Nodes in your cluster expose **ports 30080 (HTTP)** and **30443 (HTTPS)** to the outside (e.g., via HAProxy or direct access).

---

## 📁 Step 1: Add the Ingress-NGINX Helm Repository

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
```

---

## 🚀 Step 2: Install the Ingress Controller using NodePort

```bash
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.service.type=NodePort \
  --set controller.service.nodePorts.http=30080 \
  --set controller.service.nodePorts.https=30443 \
  --set controller.publishService.enabled=false
```

This will:

* Create the `ingress-nginx` namespace
* Deploy the controller
* Expose HTTP on `NodePort 30080` and HTTPS on `30443`

---

## ✅ Step 3: Verify the Deployment

```bash
kubectl get all -n ingress-nginx
```

Check that the controller Pod is running and the service is correctly exposed:

```bash
kubectl get svc -n ingress-nginx ingress-nginx-controller
```

Expected output:

```
NAME                       TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx-controller   NodePort   10.x.x.x       <none>        80:30080/TCP,443:30443/TCP   2m
```

---

## 🧪 Step 4: Deploy a Sample App with Ingress

Create a file `ingress-demo.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: httpd
spec:
  replicas: 1
  selector:
    matchLabels:
      app: httpd
  template:
    metadata:
      labels:
        app: httpd
    spec:
      containers:
      - name: httpd
        image: httpd:2.4
        ports:
        - containerPort: 80

---
apiVersion: v1
kind: Service
metadata:
  name: httpd
spec:
  selector:
    app: httpd
  ports:
  - port: 80
    targetPort: 80

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: httpd-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: httpd.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: httpd
            port:
              number: 80
```

Apply it:

```bash
kubectl apply -f ingress-demo.yaml
```

---

## 🖥 Step 5: Add Host Entry for Testing

On your **local machine** (host), add to `/etc/hosts`:

```
192.168.56.17 httpd.local
```

> Replace `192.168.56.17` with the IP of the HAProxy node or any worker node exposing port `30080`.

---

## 🌐 Step 6: Test HTTP Access

```bash
curl http://httpd.local
```

Expected result: `It works!` (Apache default page)

Or open in browser:

```
http://httpd.local
```

---

## ✅ Summary

| Purpose              | Value             |
| -------------------- | ----------------- |
| HTTP NodePort        | `30080`           |
| HTTPS NodePort       | `30443`           |
| Test Hostname        | `httpd.local`     |
| Controller Namespace | `ingress-nginx`   |
| Access via           | HAProxy or direct |

---

Would you like me to extend this with a TLS (HTTPS) example or add automated cleanup?
