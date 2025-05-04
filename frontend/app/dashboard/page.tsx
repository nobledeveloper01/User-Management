"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { motion } from "framer-motion";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import UserTable from "@/components/UseTable";
import UserForm from "@/components/UseForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { showToast } from "@/components/ShowToast";
import { EXPORT_USERS } from "@/lib/queries";
import client from "@/lib/apollo";

type User = {
  id: string;
  name: string;
  email: string;
  location?: string;
  joined?: string;
  role: string;
  status: string;
  profilePhoto?: string;
};

interface ErrorWithMessage {
  message?: string;
}

export default function Dashboard() {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const userRole = user?.role === "ADMIN" ? "ADMIN" : "USER";
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // Use the users directly from the hook (no client-side filtering needed)
  const { 
    users, 
    loading, 
    error, 
    totalPages,
  } = useUsers(
    page, 
    limit, 
    search,
    filterRole === "All" ? undefined : filterRole,
    filterStatus === "All" ? undefined : filterStatus
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filterRole, filterStatus]);

  const handleLogout = () => {
    setLogoutLoading(true);
    try {
      localStorage.removeItem("token");
      showToast("Logged out successfully", "success");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      const error = err as ErrorWithMessage; // Type assertion
      showToast(error.message || "Failed to logout", "error");
      setLogoutLoading(false);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const { data } = await client.query({
        query: EXPORT_USERS,
        variables: {
          search,
          role: filterRole === "All" ? undefined : filterRole,
          status: filterStatus === "All" ? undefined : filterStatus
        },
        fetchPolicy: 'network-only'
      });
  
      if (data?.exportUsers) {
        // Convert to CSV on the client side
        const csvContent = convertToCSV(data.exportUsers);
        downloadCSV(csvContent, "users_export.csv");
        showToast("Export completed successfully", "success");
      } else {
        throw new Error("No data received");
      }
    } catch (err) {
      showToast("Failed to export data", "error");
    } finally {
      setExportLoading(false);
    }
  };
  
  // Keep your existing convertToCSV and downloadCSV functions
  const convertToCSV = (data: User[]) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(user =>
      Object.values(user)
        .map(value => `"${value?.toString().replace(/"/g, '""') || ''}"`)
        .join(',')
    );
    return [headers, ...rows].join('\n');
  };
  
  const downloadCSV = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const LoggedInEmail = localStorage.getItem("email") || "N/A";

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-green-950 to-green-950 relative text-white"
      >
        {/* Decorative Background Shapes */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-700/50 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-600/50 rounded-full blur-3xl -z-10"></div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white/10 rounded-lg"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Integrated Navbar */}
        <motion.nav
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-white/10 backdrop-blur-xl shadow-inner shadow-white/10 p-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-10 border-b border-white/10 ${
            isMobileMenuOpen ? "block" : "hidden md:flex"
          }`}
        >
          <h1 className="text-xl font-bold text-white mb-2 md:mb-0">
            User Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-white hidden sm:inline">
              {LoggedInEmail} | {userRole}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center gap-1"
            >
              {logoutLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.nav>

        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
            {userRole === "ADMIN" && (
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg flex items-center justify-center flex-1 md:flex-none"
                >
                  <span className="mr-1">+</span>
                  <span className="hidden sm:inline">New User</span>
                  <span className="sm:hidden">Add</span>
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExport}
                  disabled={exportLoading || loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg flex items-center justify-center gap-1"
                >
                  {exportLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <span className="hidden sm:inline">Export</span>
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>

          {/* Filters - Stacked on mobile, row on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex gap-2 mb-6">
            <div className="col-span-2 sm:col-span-1 w-full">
              <SearchBar 
                onSearch={setSearchInput} 
              />
            </div>

            <div className="w-full">
              <select
                aria-label="Filter by role"
                id="filterRole"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full p-2 text-sm md:text-base bg-gray-800/50 text-white rounded-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="All">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
              </select>
            </div>

            <div className="w-full">
              <select
                aria-label="Filter by status"
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 text-sm md:text-base bg-gray-800/50 text-white rounded-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="All">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          {/* Table and Pagination */}
          {loading ? (
            <div className="text-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 p-4">
              Error: {error.message}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-400 p-4">No users found.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <UserTable
                  users={users}
                  onEdit={(user) => {
                    setSelectedUser(user);
                    setIsEditModalOpen(true);
                  }}
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  isLoading={loading}
                />
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Show:</span>
                  <select
                    aria-label="Rows per page"
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1); // Reset to first page when changing limit
                    }}
                    className="p-2 text-sm bg-gray-800/50 rounded-md text-white border border-white/10"
                  >
                    <option value="10">10 rows</option>
                    <option value="15">15 rows</option>
                    <option value="20">20 rows</option>
                    <option value="50">50 rows</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Add User Modal */}
          <Transition appear show={isAddModalOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-10"
              onClose={() => setIsAddModalOpen(false)}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
              </Transition.Child>
              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md bg-white/15 backdrop-blur-2xl rounded-lg p-6 border border-white/10 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] bg-gradient-to-b from-white/5 to-transparent">
                      <Dialog.Title className="text-2xl font-bold text-green-50 mb-4">
                        Add New User
                      </Dialog.Title>
                      <UserForm
                        onSuccess={() => {
                          setIsAddModalOpen(false);
                          // Optionally refetch users here
                        }}
                        onCancel={() => setIsAddModalOpen(false)}
                      />
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>

          {/* Edit User Modal */}
          <Transition appear show={isEditModalOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-10"
              onClose={() => setIsEditModalOpen(false)}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
              </Transition.Child>
              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md bg-white/15 backdrop-blur-2xl rounded-lg p-6 border border-white/10 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] bg-gradient-to-b from-white/5 to-transparent">
                      <Dialog.Title className="text-2xl font-bold text-green-50 mb-4">
                        Edit User
                      </Dialog.Title>
                      {selectedUser && (
                        <UserForm
                          user={selectedUser}
                          onSuccess={() => {
                            setIsEditModalOpen(false);
                            // Optionally refetch users here
                          }}
                          onCancel={() => setIsEditModalOpen(false)}
                        />
                      )}
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </motion.div>
    </ErrorBoundary>
  );
}