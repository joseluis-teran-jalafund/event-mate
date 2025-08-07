import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormInput } from '../molecules/FormInput';
import { Button } from '../atoms/Button';
import { AdvancedImage } from '@cloudinary/react';
import cld from '../../services/cloudinary/CloudinaryConfig';
import { imageUpload } from '../../services/cloudinary/CloudinaryConfig';
import { type CreateEventRequest } from '../../types/event/CreateEventRequest';
import { FiX, FiUserPlus, FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';
import type { Guest } from '../../types/guest/Guest';

interface EventFormProps {
  onSubmit: (data: CreateEventRequest) => Promise<void>;
  defaultValues?: Partial<CreateEventRequest>;
  isSubmitting?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  onSubmit,
  defaultValues,
  isSubmitting
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<CreateEventRequest>({
    defaultValues: {
      guests: [],
      ...defaultValues
    }
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isAddingEmail, setIsAddingEmail] = useState(false);

  const featuredImage = watch('featuredImage');
  const guests = watch('guests') ?? [];

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      const imageUrl = await imageUpload(file);
      setValue('featuredImage', imageUrl);
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Image upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const categories = ['Conference', 'Workshop', 'Social', 'Sports', 'Other'];

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleAddEmail = async () => {
    if (isAddingEmail) return;
    const email = emailInput.trim();

    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    if (guests.some(g => g.email === email)) {
      setEmailError('This email is already added');
      return;
    }

    setIsAddingEmail(true);
    try {
      const newGuest: Guest = {
        email,
        status: 'pending',
        invitedAt: new Date()
      };
      setValue('guests', [...guests, newGuest], { shouldValidate: true });
      setEmailInput('');
      setEmailError('');
    } finally {
      setIsAddingEmail(false);
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setValue(
      'guests',
      guests.filter(g => g.email !== emailToRemove),
      { shouldValidate: true }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const onSubmitHandler = async (data: CreateEventRequest) => {
    try {
      await onSubmit(data);
      toast.success('Event created successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to create event');
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      <FormInput
        label="Event Title"
        registration={register('title', {
          required: 'Title is required',
          minLength: {
            value: 3,
            message: 'Title must be at least 3 characters'
          }
        })}
        error={errors.title?.message}
      />

      <FormInput
        label="Description"
        registration={register('description', {
          required: 'Description is required',
          minLength: {
            value: 10,
            message: 'Description must be at least 10 characters'
          }
        })}
        error={errors.description?.message}
        as="textarea"
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Date"
          type="date"
          registration={register('date', { required: 'Date is required' })}
          error={errors.date?.message}
        />

        <FormInput
          label="Time"
          type="time"
          registration={register('time', { required: 'Time is required' })}
          error={errors.time?.message}
        />
      </div>

      <FormInput
        label="Location"
        registration={register('location', { required: 'Location is required' })}
        error={errors.location?.message}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          {...register('category', { required: 'Category is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      {/* Guest Invitations Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Invite Guests by Email
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter guest email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isAddingEmail}
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddEmail}
            icon={<FiUserPlus className="h-4 w-4" />}
            disabled={isAddingEmail}
            isLoading={isAddingEmail}
          >
            Add
          </Button>
        </div>

        {guests.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-sm font-medium text-gray-700">Invited Guests:</p>
            <ul className="space-y-2">
              {guests.map(({ email }) => (
                <li key={email} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                  <div className="flex items-center">
                    <FiMail className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">{email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="text-gray-500 hover:text-red-500"
                    aria-label={`Remove ${email} from guest list`}
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Featured Image (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled={isUploading}
        />

        {(imagePreview || featuredImage) && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Event preview"
                className="h-40 w-40 object-cover rounded-md"
              />
            ) : (
              <AdvancedImage
                cldImg={cld.image(featuredImage).resize('fill', 160, 160)}
                className="h-40 w-40 object-cover rounded-md"
                alt="Event featured image"
              />
            )}
          </div>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isSubmitting || isUploading}
        isLoading={isSubmitting || isUploading}
      >
        {isSubmitting ? 'Saving...' : 'Save Event'}
      </Button>
    </form>
  );
};
