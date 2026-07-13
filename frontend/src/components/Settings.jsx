import { useState } from "react";

const initialSettings = {
  emailNotifications: true,
  alertNotifications: true,
  pipelineNotifications: false,
  weeklyReports: true,
  twoFactorAuth: false,
  sessionTimeout: "30",
  passwordAlerts: true,
  slackIntegration: false,
  emailIntegration: true,
  snowflakeIntegration: false,
  theme: "Light",
  density: "Comfortable",
  language: "English",
};

function Settings() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const handleToggle = (name) => {
    setSettings((current) => ({
      ...current,
      [name]: !current[name],
    }));

    setSaved(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSettings((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem(
      "cortexos-settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Settings</h2>

          <p style={styles.subtitle}>
            Manage notifications, security, integrations, and
            appearance preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={saveSettings}
          style={styles.saveButton}
        >
          Save Changes
        </button>
      </div>

      {saved && (
        <div style={styles.successCard}>
          Settings saved successfully.
        </div>
      )}

      <div style={styles.grid}>
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.icon}>🔔</div>

            <div>
              <h3 style={styles.cardTitle}>Notifications</h3>

              <p style={styles.cardDescription}>
                Control how CortexOS sends updates and alerts.
              </p>
            </div>
          </div>

          <SettingToggle
            title="Email Notifications"
            description="Receive important platform updates by email."
            checked={settings.emailNotifications}
            onChange={() =>
              handleToggle("emailNotifications")
            }
          />

          <SettingToggle
            title="Alert Notifications"
            description="Receive notifications for new platform alerts."
            checked={settings.alertNotifications}
            onChange={() =>
              handleToggle("alertNotifications")
            }
          />

          <SettingToggle
            title="Pipeline Notifications"
            description="Receive updates when pipeline runs fail."
            checked={settings.pipelineNotifications}
            onChange={() =>
              handleToggle("pipelineNotifications")
            }
          />

          <SettingToggle
            title="Weekly Reports"
            description="Receive a weekly data health summary."
            checked={settings.weeklyReports}
            onChange={() =>
              handleToggle("weeklyReports")
            }
          />
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.icon}>🔒</div>

            <div>
              <h3 style={styles.cardTitle}>Security</h3>

              <p style={styles.cardDescription}>
                Configure account and session security.
              </p>
            </div>
          </div>

          <SettingToggle
            title="Two-Factor Authentication"
            description="Add an additional verification step."
            checked={settings.twoFactorAuth}
            onChange={() =>
              handleToggle("twoFactorAuth")
            }
          />

          <SettingToggle
            title="Password Change Alerts"
            description="Notify you when your password is changed."
            checked={settings.passwordAlerts}
            onChange={() =>
              handleToggle("passwordAlerts")
            }
          />

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Session Timeout
            </label>

            <select
              name="sessionTimeout"
              value={settings.sessionTimeout}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.icon}>🔌</div>

            <div>
              <h3 style={styles.cardTitle}>Integrations</h3>

              <p style={styles.cardDescription}>
                Connect CortexOS with external platforms.
              </p>
            </div>
          </div>

          <SettingToggle
            title="Slack"
            description="Send alerts and pipeline updates to Slack."
            checked={settings.slackIntegration}
            onChange={() =>
              handleToggle("slackIntegration")
            }
          />

          <SettingToggle
            title="Email"
            description="Enable outbound email notifications."
            checked={settings.emailIntegration}
            onChange={() =>
              handleToggle("emailIntegration")
            }
          />

          <SettingToggle
            title="Snowflake"
            description="Connect CortexOS with Snowflake."
            checked={settings.snowflakeIntegration}
            onChange={() =>
              handleToggle("snowflakeIntegration")
            }
          />
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.icon}>🎨</div>

            <div>
              <h3 style={styles.cardTitle}>Appearance</h3>

              <p style={styles.cardDescription}>
                Customize the CortexOS interface.
              </p>
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Theme</label>

            <select
              name="theme"
              value={settings.theme}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
              <option value="System">System Default</option>
            </select>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Interface Density
            </label>

            <select
              name="density"
              value={settings.density}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="Compact">Compact</option>
              <option value="Comfortable">
                Comfortable
              </option>
              <option value="Spacious">Spacious</option>
            </select>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Language</label>

            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  );
}

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div style={styles.settingRow}>
      <div>
        <div style={styles.settingTitle}>{title}</div>

        <div style={styles.settingDescription}>
          {description}
        </div>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        style={{
          ...styles.toggle,
          background: checked ? "#2563EB" : "#D1D5DB",
        }}
      >
        <span
          style={{
            ...styles.toggleCircle,
            transform: checked
              ? "translateX(22px)"
              : "translateX(0)",
          }}
        />
      </button>
    </div>
  );
}

const styles = {
  page: {
    padding: "8px 0 32px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "20px",
  },

  title: {
    margin: 0,
    color: "#111827",
    fontSize: "30px",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#6B7280",
  },

  saveButton: {
    border: "none",
    borderRadius: "10px",
    padding: "11px 18px",
    background: "#2563EB",
    color: "#FFFFFF",
    fontWeight: 700,
    cursor: "pointer",
  },

  successCard: {
    marginBottom: "18px",
    padding: "13px 16px",
    border: "1px solid #BBF7D0",
    borderRadius: "10px",
    background: "#F0FDF4",
    color: "#166534",
    fontWeight: 600,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  card: {
    padding: "22px",
    border: "1px solid #E5E7EB",
    borderRadius: "16px",
    background: "#FFFFFF",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "10px",
  },

  icon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#EFF6FF",
    fontSize: "20px",
  },

  cardTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "18px",
  },

  cardDescription: {
    margin: "5px 0 0",
    color: "#6B7280",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  settingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    padding: "16px 0",
    borderBottom: "1px solid #E5E7EB",
  },

  settingTitle: {
    color: "#111827",
    fontWeight: 600,
  },

  settingDescription: {
    marginTop: "4px",
    color: "#6B7280",
    fontSize: "13px",
    lineHeight: 1.45,
  },

  toggle: {
    position: "relative",
    flexShrink: 0,
    width: "46px",
    height: "24px",
    padding: "2px",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },

  toggleCircle: {
    display: "block",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#FFFFFF",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    transition: "transform 0.2s ease",
  },

  fieldGroup: {
    marginTop: "18px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#374151",
    fontSize: "14px",
    fontWeight: 600,
  },

  select: {
    boxSizing: "border-box",
    width: "100%",
    padding: "11px 13px",
    border: "1px solid #D1D5DB",
    borderRadius: "9px",
    background: "#FFFFFF",
    color: "#111827",
    fontSize: "14px",
  },
};

export default Settings;