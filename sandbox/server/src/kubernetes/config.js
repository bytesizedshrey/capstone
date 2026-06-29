import * as K8sApi from '@kubernetes/client-node';
import fs from 'fs';
import path from 'path';

const kc = new K8sApi.KubeConfig();

if (process.env.KUBECONFIG_BASE64) {
  try {
    const kubeconfigContent = Buffer.from(process.env.KUBECONFIG_BASE64, 'base64').toString('utf-8');
    const tmpPath = path.join('/tmp', `kubeconfig_${Date.now()}`);
    fs.writeFileSync(tmpPath, kubeconfigContent, { mode: 0o600 });
    kc.loadFromFile(tmpPath);
    console.log('[K8s Config] Loaded kubeconfig from KUBECONFIG_BASE64');
  } catch (err) {
    console.error('[K8s Config] Failed to load KUBECONFIG_BASE64, falling back to default:', err.message);
    kc.loadFromDefault();
  }
} else {
  kc.loadFromDefault();
  console.log('[K8s Config] Loaded default/in-cluster kubeconfig');
}

export const k8sCoreV1Api = kc.makeApiClient(K8sApi.CoreV1Api);
