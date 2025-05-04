import User from '../../models/User';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { handleError } from '../../utils/errorHandler';
import bcrypt from 'bcryptjs';

export const userResolvers = {
  Query: {
    users: async (
      _: any,
      { page, limit, search, role, status }: { 
        page: number; 
        limit: number; 
        search?: string;
        role?: string;
        status?: string;
      },
      { user }: any
    ) => {
      try {
        if (!user) throw new AuthenticationError('Unauthorized');
    
        const query: any = {};
    
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ];
        }
    
        if (role) query.role = role;
        if (status) query.status = status;
    
        const totalUsers = await User.countDocuments(query);
        // Sort by createdAt in descending order (-1)
        const users = await User.find(query)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit);
    
        return {
          users: users.map(user => ({
            ...user.toObject(),
            id: user._id.toString(),
            createdAt: user.createdAt.toISOString()
          })),
          totalCount: totalUsers,
          totalPages: Math.ceil(totalUsers / limit),
          currentPage: page,
        };
      } catch (error) {
        throw handleError(error);
      }
    },

    user: async (_: any, { id }: { id: string }, { user }: any) => {
      try {
        if (!user || user.role !== 'ADMIN') throw new AuthenticationError('Unauthorized');
        const foundUser = await User.findById(id);
        if (!foundUser) throw new UserInputError('User not found');
        return foundUser;
      } catch (error) {
        throw handleError(error);
      }
    },

    exportUsers: async (
      _: any,
      { search, role, status }: { 
        search?: string;
        role?: string;
        status?: string;
      },
      { user }: any
    ) => {
      try {
        if (!user) throw new AuthenticationError('Unauthorized');
    
        const query: any = {};
        
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ];
        }
    
        if (role) query.role = role;
        if (status) query.status = status;
    
        // Sort by createdAt in descending order (-1)
        const users = await User.find(query)
          .sort({ createdAt: -1 })
          .lean();
        
        return users.map(user => ({
          ...user,
          id: user._id.toString(),
          createdAt: user.createdAt.toISOString()
        }));
        
      } catch (error) {
        throw handleError(error);
      }
    }
  },

  

  Mutation: {
    createUser: async (_: any, { input }: { input: any }, { user }: any) => {
      try {
        if (!user || user.role !== 'ADMIN') throw new AuthenticationError('Unauthorized');
  
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) throw new UserInputError('Email already exists');
  
        const hashedPassword = await bcrypt.hash(input.password, 10);
  
        const newUser = new User({
          ...input,
          password: hashedPassword,
          role: input.role || 'USER',
          status: input.status || 'ACTIVE',
        });
  
        await newUser.save();
  
        // Explicitly return all required fields
        return {
          id: newUser._id.toString(), // Convert ObjectId to string
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
          profilePhoto: newUser.profilePhoto || null,
          location: newUser.location || null,
          createdAt: newUser.createdAt.toISOString()
        };
      } catch (error) {
        throw handleError(error);
      }
    },
  
    updateUser: async (_: any, { id, input }: { id: string; input: any }, { user }: any) => {
      try {
        if (!user || user.role !== 'ADMIN') throw new AuthenticationError('Unauthorized');
        const updatedUser = await User.findByIdAndUpdate(id, input, { 
          new: true,
          runValidators: true // Ensures updates follow schema rules
        });
        
        if (!updatedUser) throw new UserInputError('User not found');
        
        // Explicitly return all required fields
        return {
          id: updatedUser._id.toString(),
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          status: updatedUser.status,
          profilePhoto: updatedUser.profilePhoto || null,
          location: updatedUser.location || null,
          createdAt: updatedUser.createdAt.toISOString()
        };
      } catch (error) {
        throw handleError(error);
      }
    },

    deleteUser: async (_: any, { id }: { id: string }, { user }: any) => {
      try {
        if (!user || user.role !== 'ADMIN') throw new AuthenticationError('Unauthorized');
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) throw new UserInputError('User not found');
        return true;
      } catch (error) {
        throw handleError(error);
      }
    },

    deleteMultipleUsers: async (_: any, { ids }: { ids: string[] }, { user }: any) => {
      try {
        if (!user || user.role !== 'ADMIN') throw new AuthenticationError('Unauthorized');

        if (!ids || ids.length === 0) throw new UserInputError('No user IDs provided');

        const result = await User.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount === 0) throw new UserInputError('No users found with the provided IDs');
        if (result.deletedCount < ids.length) {
          console.warn(`Only ${result.deletedCount} out of ${ids.length} users were deleted`);
        }

        return true;
      } catch (error) {
        throw handleError(error);
      }
    },

    
  
  
  },
};
