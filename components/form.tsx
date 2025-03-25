'use client';

import { AddressSchema, addressSchema } from '@/lib/schemas/address';
import { PersonalInfo, personalInfoSchema } from '@/lib/schemas/user/create-user';
import {
  ACCEPTED_CV_TYPES,
  jobPositionEnum,
  ProfessionSchema,
  professionSchema,
} from '@/lib/schemas/user/profession';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { defineStepper } from '@stepperize/react';
import { BriefcaseBusiness, CheckCircle, Home, User } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { z, ZodObject } from 'zod';
import { Datepicker } from './ui/date-picker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const stepper = defineStepper(
  { id: 'personal-info', label: 'Personal Information', icon: User, schema: personalInfoSchema },
  { id: 'address', label: 'Address Information', icon: Home, schema: addressSchema },
  {
    id: 'professional',
    label: 'Professional Information',
    icon: BriefcaseBusiness,
    schema: professionSchema,
  },
  { id: 'success', label: 'Success', icon: CheckCircle, schema: z.object({}) }
);

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 500 : -500, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 500 : -500, opacity: 0 }),
};

export const DemoSection = ({ className }: { className?: string }) => {
  return (
    <stepper.Scoped>
      <section id="demo" className={cn('relative px-4 sm:px-6 lg:px-8', className)}>
        <DemoContent />
      </section>
    </stepper.Scoped>
  );
};

// #region DemoContent

function createFieldMap(steps: { id: string; schema: ZodObject<any> }[]) {
  return steps.flatMap((step) => {
    const iterable = step.schema.keyof();
    //@ts-ignore
    return iterable.options.map((key) => ({ id: step.id, key }));
  });
}
const DemoContent = () => {
  const methods = stepper.useStepper();
  const form = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(methods.current.schema),
    defaultValues: {
      birthDate: new Date(),
      Token: '',
      ElectronicSignature: '',
    },
  });

  const map = createFieldMap(methods.all);
  function handleSubmitUserInfo(data: any) {
    if (!methods.isLast) {
      methods.next();
    } else {
      const apiErr: {
        statusCode: 400;
        success: false;
        error: { [Property in string]: { Code?: number; Message: string } };
      } = {
        statusCode: 400,
        success: false,
        error: {
          name: { Message: 'Nome do usuário não pode ser assim :/' },
          birthDate: { Message: 'Data de aniversário meio paia :/' },
          position: { Message: 'Vish, esse cargo ai é meio ruim né? :/' },
        },
      };

      Object.keys(apiErr.error).forEach((err) => {
        map.forEach((mapItem) => {
          if (err === mapItem.key) {
            methods.goTo(mapItem.id);
            methods.beforeGoTo(mapItem.id, () => {
              form.setError(
                //@ts-ignore
                `${mapItem.key}`,
                {
                  message: apiErr.error[err].Message,
                },
                { shouldFocus: true }
              );

              return true;
            });
          }
        });
      });
    }
  }

  function handleReset() {
    form.reset();
    methods.goTo('personal-info');
  }

  const isComplete = methods.isLast;
  const isValid = form.formState.isValid;

  return (
    <Form {...form}>
      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2
            className="mb-4 text-3xl font-bold sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <span className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
              Form demo
            </span>
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-lg text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            Interactive demo of a multi-step form using @stepperize/react, zod and react-hook-form
          </motion.p>
        </motion.div>

        <motion.div
          className="overflow-hidden rounded-xl border shadow-xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            type: 'spring',
            stiffness: 50,
          }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <StepperHeader methods={methods} isComplete={isComplete} />
          <div className="p-8">
            <form onSubmit={form.handleSubmit(handleSubmitUserInfo)}>
              <AnimatePresence mode="wait" custom={methods.current.id}>
                <motion.div
                  key="step1"
                  custom={methods.current.id}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  {methods.switch({
                    'personal-info': () => {
                      return <PersonalInfoStep />;
                    },
                    address: () => {
                      return <AddressStep />;
                    },
                    professional: () => {
                      return <ProfessionalStep />;
                    },
                    success: () => {
                      return <CompletionScreen onReset={handleReset} />;
                    },
                  })}
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 flex justify-between">
                {!methods.isFirst && (
                  <motion.button
                    type="button"
                    onClick={methods.prev}
                    className="rounded-md border border-gray-700 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-800"
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    Back
                  </motion.button>
                )}
                <motion.div
                  className="ml-auto"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    type="submit"
                    className="cursor-pointer rounded-md bg-gradient-to-r from-indigo-700 to-purple-700 px-6 py-2 text-gray-100 shadow-md transition-all duration-300 hover:from-indigo-800 hover:to-purple-800 hover:shadow-indigo-700/30 disabled:cursor-not-allowed disabled:opacity-60"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    // disabled={!isValid}
                  >
                    {isComplete ? 'Submit' : 'Next'}
                  </motion.button>
                </motion.div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </Form>
  );
};

// #endregion DemoContent

// #region InputField

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
}: React.ComponentPropsWithoutRef<'input'> & {
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute;
  value: string | number | readonly string[] | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
  };
  return (
    <motion.div variants={itemVariants}>
      {/* <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-800">
        {label}
      </label> */}
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-md border border-gray-400 bg-gray-100 px-3 py-2 text-gray-800 transition-all duration-200 focus:ring-2 focus:ring-indigo-700 focus:outline-none"
      />
    </motion.div>
  );
};

// #endregion InputField

// #region StepperHeader

const StepperHeader = ({
  methods,
  isComplete,
}: {
  methods: ReturnType<typeof stepper.useStepper>;
  isComplete: boolean;
}) => {
  const currentIndex = methods.all.findIndex((step: any) => step.id === methods.current.id);
  const form = useFormContext();
  return (
    <nav className="bg-gray-400/30 p-8">
      <ol className="relative flex items-center justify-between">
        <div className="absolute top-5 right-4 left-4 z-0 h-0.5 bg-gray-600 sm:left-12">
          <motion.div
            className="bg-indigo-11 h-full"
            initial={{ width: '0%' }}
            animate={{
              width:
                methods.current.id === methods.all[methods.all.length - 1].id || isComplete
                  ? '100%'
                  : `${(currentIndex / (methods.all.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
        {methods.all.map((step: any, index: number) => {
          const isActive = step.id === methods.current.id;
          return (
            <motion.li
              key={step.id}
              className="relative z-10 flex flex-shrink-0 flex-col items-center"
              onClick={async () => {
                const isValid = form.formState.isValid;
                if (!isValid) return;
                methods.goTo(step.id);
              }}
              whileHover={!isComplete ? { scale: 1.05 } : {}}
              whileTap={!isComplete ? { scale: 0.95 } : {}}
            >
              <motion.div
                className={cn(
                  'flex size-10 cursor-pointer items-center justify-center rounded-full',
                  index <= currentIndex
                    ? 'bg-indigo-700 text-indigo-100'
                    : isActive || isComplete
                      ? 'bg-green-700 text-green-100'
                      : 'bg-gray-800 text-gray-100'
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 10,
                  delay: 0.1 * index,
                }}
              >
                {index < currentIndex || isComplete ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle className="size-5" />
                  </motion.div>
                ) : (
                  <step.icon className="size-5" />
                )}
              </motion.div>
              <motion.span
                className={cn(
                  'mt-2 hidden text-xs sm:block',
                  isActive ? 'font-medium text-indigo-700' : !isComplete && 'text-gray-700'
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + 0.1 * index }}
              >
                {step.label}
              </motion.span>
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
};

// #endregion StepperHeader

// #region PersonalInfoStep

const PersonalInfoStep = () => {
  const form = useFormContext<PersonalInfo>();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <h3 className="mb-6 text-xl font-semibold text-gray-800">Personal Information</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field: { name, onChange, value = '' } }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <InputField label="First Name" name={name} value={value} onChange={onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field: { name, onChange, value = '' } }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <InputField
                  label="Email"
                  type="email"
                  name={name}
                  value={value}
                  onChange={onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userName"
          render={({ field: { name, onChange, value = '' } }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <InputField label="Username" name={name} value={value} onChange={onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field: { name, onChange, value = new Date() } }) => (
            <FormItem>
              <FormLabel>Birth date</FormLabel>
              <FormControl>
                <Datepicker name={name} value={value} onChange={onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );
};

// #endregion PersonalInfoStep

// #region AddressStep

const AddressStep = () => {
  const form = useFormContext<AddressSchema>();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <h3 className="mb-6 text-xl font-semibold text-gray-800">Address Information</h3>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="street"
          render={({ field: { name, onChange, value = '' } }) => (
            <FormItem>
              <FormLabel>Street</FormLabel>
              <FormControl>
                <InputField label="Street" name={name} value={value} onChange={onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field: { name, onChange, value = '' } }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <InputField label="City" name={name} value={value} onChange={onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field: { name, onChange, value = '' } }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <InputField label="Zip Code" name={name} value={value} onChange={onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="number"
            render={({ field: { name, onChange, value = '' } }) => (
              <FormItem>
                <FormLabel>Number</FormLabel>
                <FormControl>
                  <InputField
                    type="number"
                    label="Number"
                    name={name}
                    value={value.toString()}
                    onChange={(e) => onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field: { name, onChange, value = '' } }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <InputField label="State" name={name} value={value} onChange={onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </motion.div>
  );
};

// #endregion AddressStep

// #region PaymentStep

const ProfessionalStep = () => {
  const form = useFormContext<ProfessionSchema>();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const accept = ACCEPTED_CV_TYPES.join(',');

  console.log(accept);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <h3 className="mb-6 text-xl font-semibold text-gray-800">Payment Information</h3>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="position"
          render={({ field: { name, onChange, value = '' } }) => (
            <FormItem className="w-full">
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Select onValueChange={onChange} name={name} value={value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {jobPositionEnum.options.map((val) => {
                        return (
                          <SelectItem key={val} value={val}>
                            {val}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cv"
          render={({ field: { name, onChange, value = '' } }) => (
            <FormItem>
              <FormLabel>CV</FormLabel>
              <FormControl>
                <InputField
                  label="CV"
                  value={value}
                  name={name}
                  onChange={(e) => onChange(e.target.files?.[0])}
                  type="file"
                  accept={accept}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="skills"
          render={({ field: { name, onChange, value = "" } }) => {
            return (
              <FormControl>
                <InputField label="Street" name={name} value={value} onChange={onChange} type='file' />
                <FormMessage />
              </FormControl>
            );
          }}
        /> */}
      </div>
    </motion.div>
  );
};

// #endregion PaymentStep

// #region CompletionScreen

const CompletionScreen = ({ onReset }: { onReset: () => void }) => (
  <motion.div
    className="py-10 text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
  >
    <motion.div
      className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-green-700"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
    >
      <CheckCircle className="size-10 text-gray-100" />
    </motion.div>
    <motion.h3
      className="mb-2 text-2xl font-bold text-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      Success!
    </motion.h3>
    <motion.p
      className="text-gray-12 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      Your form has been submitted successfully.
    </motion.p>
    <motion.button
      type="button"
      onClick={onReset}
      className="rounded-md bg-indigo-700 px-4 py-2 text-gray-100 transition-colors hover:bg-indigo-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Start Over
    </motion.button>
  </motion.div>
);

// #endregion CompletionScreen
