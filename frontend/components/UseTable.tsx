"use client";

import { useMutation } from "@apollo/client";
import { Fragment } from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { DELETE_USER, DELETE_MULTIPLE_USERS } from "@/lib/queries";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import { showToast } from "@/components/ShowToast";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
}

export default function UserTable({ users, onEdit }: UserTableProps) {
  const { user } = useAuth();
  const userRole = user?.role === "ADMIN" ? "ADMIN" : "USER";
  const [deleteUser, { loading: deleteLoading }] = useMutation(DELETE_USER);
  const [deleteMultipleUsers, { loading: batchDeleteLoading }] = useMutation(
    DELETE_MULTIPLE_USERS
  );

  // State for selected users and modal
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Handle individual checkbox selection
  const handleSelect = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
      setSelectAll(false);
    } else {
      setSelectedUsers([...selectedUsers, userId]);
      if (selectedUsers.length + 1 === users.length) {
        setSelectAll(true);
      }
    }
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
      setSelectAll(false);
    } else {
      setSelectedUsers(users.map((user) => user.id));
      setSelectAll(true);
    }
  };

  // Open modal for single user deletion
  const confirmDelete = (id: string) => {
    setUserToDelete(id);
    setShowModal(true);
  };

  // Handle single user deletion

  const handleDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser({
          variables: { id: userToDelete },
          refetchQueries: ["GetUsers"],
        });
        showToast("User deleted successfully", "success");
        setSelectedUsers(
          selectedUsers.filter((userId) => userId !== userToDelete)
        );
        setUserToDelete(null);
        setShowModal(false);
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "Failed to delete user",
          "error"
        );
      }
    }
  };

  // Handle multiple users deletion
  const handleBatchDelete = async () => {
    if (selectedUsers.length === 0) return;

    try {
      await deleteMultipleUsers({
        variables: { ids: selectedUsers },
        refetchQueries: ["GetUsers"],
      });
      showToast(
        `${selectedUsers.length} user(s) deleted successfully`,
        "success"
      );
      setSelectedUsers([]);
      setSelectAll(false);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to delete users",
        "error"
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Batch Actions Bar */}
      {userRole === "ADMIN" && selectedUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex items-center gap-2 p-2 bg-red-500/10 rounded-lg border border-red-500/20"
        >
          <span className="text-white font-medium ml-2">
            {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""}{" "}
            selected
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBatchDelete}
            disabled={batchDeleteLoading}
            className="ml-auto px-3 py-1 bg-red-500 text-white rounded flex items-center gap-1 hover:bg-red-600 disabled:opacity-50"
          >
            {batchDeleteLoading ? (
              <span><LoadingSpinner /></span> 
            ) : (
              <>Delete Selected</>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/15 backdrop-blur-2xl rounded-lg border border-white/10 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] overflow-x-auto no-scrollbar::-webkit-scrollbar no-scrollbar"
      >
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-4">
                <input
                  aria-label="Select all users"
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 accent-green-400 cursor-pointer"
                />
              </th>
              <th className="p-4 text-nowrap">Full Name</th>
              <th className="p-4 text-nowrap">Email Address</th>
              <th className="p-4 text-nowrap">Location</th>
              <th className="p-4 text-nowrap">Joined</th>
              <th className="p-4 text-nowrap">Permissions</th>
              <th className="p-4 text-nowrap">Status</th>
              {userRole === "ADMIN" && <th className="p-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={userRole === "ADMIN" ? 7 : 6}
                  className="p-4 text-center text-gray-400"
                >
                  No users available.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`border-b border-white/10 last:border-none ${
                    selectedUsers.includes(user.id) ? "bg-green-400/10" : ""
                  }`}
                >
                  <td className="p-4 text-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelect(user.id)}
                      className="w-4 h-4 accent-green-400 cursor-pointer"
                    />
                  </td>
                  <td className="p-4 flex items-center gap-2 text-nowrap">
                    <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-xs font-bold text-green-950">
                      {user.profilePhoto ? (
                        <img 
                          src={user.profilePhoto}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {user.name}
                  </td>
                  <td className="p-4 text-nowrap">{user.email}</td>
                  <td className="p-4 text-nowrap">{user.location || "N/A"}</td>
                  <td className="p-4 text-nowrap">
                    {user.joined ||
                      new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                  </td>
                  <td className="p-4 text-nowrap">
                    <span
                      className={`px-2 py-1 rounded ${
                        user.role.toLowerCase() === "admin"
                          ? "bg-red-500"
                          : user.role.toLowerCase() === "user"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      } text-white`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-nowrap">
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </td>

                  {userRole === "ADMIN" && (
                    <td className="p-4 text-nowrap">
                      <div className="flex items-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEdit(user)}
                          className="text-green-400 hover:text-green-300 mr-4"
                          aria-label="Edit user"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => confirmDelete(user.id)}
                          disabled={deleteLoading}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50"
                          aria-label="Delete user"
                        >
                          {deleteLoading ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                        </motion.button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setShowModal(false)}
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
                  <Dialog.Title className="text-lg font-medium leading-6 text-white">
                    Confirm Deletion
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-300">
                      Are you sure you want to delete this user?
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="mr-2 px-4 py-2 bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-500 text-white rounded"
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? (
                        <span className="loader"></span>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
