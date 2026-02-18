import { DashboardLayout } from "@/components/dashboard-layout";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="shell dashboard-content">
        <div className="page-header">
          <h1>Profile Settings</h1>
          <p>Manage your account information and preferences</p>
        </div>
        <div className="profile-section">
          <p>Profile management coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
