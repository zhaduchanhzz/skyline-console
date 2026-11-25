import { action, observable } from 'mobx';
import client from 'client';
import { isFeatureEnabled, isPathEnabled } from 'utils/features';

export class FeatureStore {
  @observable values = {};

  @observable ready = false;

  @observable error = false;

  // skyline.yaml `kagent_chat` (AI Assistant). `ref` keeps plain objects and
  // arrays: mobx 5 observable arrays fail Array.isArray.
  @observable.ref kagentChat = null;

  isEnabled = (key) => isFeatureEnabled(this.values, key);

  isPathEnabled = (path) => isPathEnabled(this.values, path);

  @action
  async fetch() {
    this.ready = false;
    this.error = false;
    try {
      const { features, kagent_chat: kagentChat } =
        await client.skyline.features();
      if (
        !features ||
        typeof features !== 'object' ||
        Array.isArray(features)
      ) {
        throw new Error('Invalid features response');
      }
      this.values = features;
      this.kagentChat =
        kagentChat && typeof kagentChat === 'object' ? kagentChat : null;
      this.ready = true;
    } catch (error) {
      // The upstream Skyline API image has no optional /features
      // route. An empty map keeps the console's default panel visibility.
      if (error.response?.status === 404) {
        this.values = {};
        this.kagentChat = null;
        this.ready = true;
      } else {
        this.error = true;
      }
    }
  }

  @action
  clearData() {
    this.values = {};
    this.kagentChat = null;
    this.ready = false;
    this.error = false;
  }
}

export default new FeatureStore();
