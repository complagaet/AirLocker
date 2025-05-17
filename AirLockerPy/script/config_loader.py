import json
import os

DEFAULT_SETTINGS = {
    "api": "https://airlocker.onrender.com/api",
    "token": "",
    "username": "",
    "email": "",
    "lockers": [],
    "lockerId": "",
    "port": ""
}

CONFIG_FILE = "settings.json"


class ConfigLoader:
    def __init__(self, filename=CONFIG_FILE, defaults=DEFAULT_SETTINGS):
        self.filename = filename
        self.defaults = defaults
        self.settings = self.load_settings()

    def load_settings(self):
        if not os.path.exists(self.filename):
            return self._create_default_config()

        try:
            with open(self.filename, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return self._create_default_config()

    def _create_default_config(self):
        with open(self.filename, "w", encoding="utf-8") as f:
            json.dump(self.defaults, f, indent=4)
        return self.defaults.copy()

    def get_settings(self):
        return self.settings

    def set_setting(self, key, value):
        self.settings[key] = value
        self.save_settings()

    def save_settings(self):
        try:
            with open(self.filename, "w", encoding="utf-8") as f:
                json.dump(self.settings, f, indent=4)
        except IOError as e:
            print(f"Ошибка при сохранении настроек: {e}")


# Пример использования:
if __name__ == "__main__":
    config = ConfigLoader()

    print("Текущие настройки:", config.get_settings())

    # Пример изменения настройки:
    config.set_setting("theme", "dark")
    config.set_setting("refresh_interval", 60)

    print("Обновленные настройки:", config.get_settings())
