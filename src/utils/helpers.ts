import AsyncStorage from '@react-native-async-storage/async-storage';

export class LocalStorage {
  static async read(key: LocalStorage.Key) {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? data : null;
    } catch (error) {
      console.warn('LocalStorage', error);
    }
  }

  static async write(key: LocalStorage.Key, value: string | undefined) {
    try {
      if (value) {
        await AsyncStorage.setItem(key, value);
      } else {
        await this.delete(key);
      }
    } catch (error) {
      console.warn('LocalStorage', error);
    }
  }

  static async delete(key: LocalStorage.Key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn('LocalStorage', error);
    }
  }
}

export namespace LocalStorage {
  export enum Key {
    AccessToken = '@access_token',
    RefreshToken = '@refresh_token',
    UserData = '@user_data',
    UserName = '@user_name',
  }
}
