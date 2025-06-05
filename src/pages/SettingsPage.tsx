import React from 'react';
import Header from '@/components/layout/Header';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label'; // shadcn Label
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, KeyRound, Bell, ShieldCheck, FileText, Mail, Phone } from 'lucide-react';

const TSB_PRIMARY_COLOR = '#00A8E1';

const profileSchema = z.object({
  fullName: z.string().optional(), // Assuming read-only for now
  email: z.string().email("Invalid email address.").optional(),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number.").optional(),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

const notificationSchema = z.object({
  emailNotifications: z.boolean().default(false),
  pushNotifications: z.boolean().default(true),
  smsAlerts: z.boolean().default(false),
});
type NotificationFormValues = z.infer<typeof notificationSchema>;


const SettingsPage = () => {
  console.log('SettingsPage loaded');

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: 'John Doe (Read Only)', email: 'john.doe@example.com', phoneNumber: '+447123456789' },
  });
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: { emailNotifications: true, pushNotifications: true, smsAlerts: false },
  });

  const onProfileSubmit = (data: ProfileFormValues) => console.log("Profile Updated:", data);
  const onNotificationsSubmit = (data: NotificationFormValues) => console.log("Notifications Updated:", data);


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <NavigationMenu />
        <main className="flex-grow p-4 sm:ml-64 pb-20 sm:pb-4 space-y-6">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-[--tsb-text]" style={{'--tsb-text': '#131B33'} as React.CSSProperties}>Settings & Preferences</CardTitle>
              <CardDescription>Manage your account, security, and notification settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full" defaultValue="profile">
                <AccordionItem value="profile">
                  <AccordionTrigger className="text-lg hover:no-underline">
                    <div className="flex items-center">
                        <User className="mr-3 h-5 w-5 text-[--tsb-primary]" style={{'--tsb-primary': TSB_PRIMARY_COLOR} as React.CSSProperties} /> Profile Information
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <Card className="border-none shadow-none">
                      <CardContent>
                        <Form {...profileForm}>
                          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                            <FormField control={profileForm.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input readOnly {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={profileForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><div className="flex items-center"><Mail className="h-4 w-4 mr-2 text-gray-400" /><FormControl><Input type="email" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                            <FormField control={profileForm.control} name="phoneNumber" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><div className="flex items-center"><Phone className="h-4 w-4 mr-2 text-gray-400" /><FormControl><Input type="tel" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                            <Button type="submit" className="bg-[--tsb-primary] hover:bg-[--tsb-primary]/90 text-white" style={{'--tsb-primary': TSB_PRIMARY_COLOR} as React.CSSProperties}>Save Profile Changes</Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="security">
                  <AccordionTrigger className="text-lg hover:no-underline">
                     <div className="flex items-center">
                        <KeyRound className="mr-3 h-5 w-5 text-[--tsb-primary]" style={{'--tsb-primary': TSB_PRIMARY_COLOR} as React.CSSProperties} /> Security Settings
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                     <Card className="border-none shadow-none">
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-md border">
                                <div>
                                    <Label htmlFor="change-password-btn" className="font-medium">Password</Label>
                                    <p className="text-sm text-muted-foreground">Change your login password regularly for security.</p>
                                </div>
                                <Button id="change-password-btn" variant="outline">Change Password</Button>
                            </div>
                             <div className="flex justify-between items-center p-3 rounded-md border">
                                <div>
                                    <Label htmlFor="mfa-btn" className="font-medium">Multi-Factor Authentication (MFA)</Label>
                                    <p className="text-sm text-muted-foreground">Manage your MFA methods and trusted devices.</p>
                                </div>
                                <Button id="mfa-btn" variant="outline">Manage MFA</Button>
                            </div>
                        </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="notifications">
                  <AccordionTrigger className="text-lg hover:no-underline">
                    <div className="flex items-center">
                        <Bell className="mr-3 h-5 w-5 text-[--tsb-primary]" style={{'--tsb-primary': TSB_PRIMARY_COLOR} as React.CSSProperties} /> Notification Preferences
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <Card className="border-none shadow-none">
                        <CardContent>
                            <Form {...notificationForm}>
                            <form onSubmit={notificationForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                                <FormField
                                control={notificationForm.control}
                                name="emailNotifications"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Email Notifications</FormLabel>
                                        <FormDescription>Receive updates and alerts via email.</FormDescription>
                                    </div>
                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={notificationForm.control}
                                name="pushNotifications"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Push Notifications</FormLabel>
                                        <FormDescription>Get real-time alerts on your mobile device.</FormDescription>
                                    </div>
                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={notificationForm.control}
                                name="smsAlerts"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>SMS Alerts</FormLabel>
                                        <FormDescription>Receive critical alerts via SMS (charges may apply).</FormDescription>
                                    </div>
                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    </FormItem>
                                )}
                                />
                                <Button type="submit" className="bg-[--tsb-primary] hover:bg-[--tsb-primary]/90 text-white" style={{'--tsb-primary': TSB_PRIMARY_COLOR} as React.CSSProperties}>Save Notification Settings</Button>
                            </form>
                            </Form>
                        </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="legal">
                  <AccordionTrigger className="text-lg hover:no-underline">
                     <div className="flex items-center">
                        <FileText className="mr-3 h-5 w-5 text-[--tsb-primary]" style={{'--tsb-primary': TSB_PRIMARY_COLOR} as React.CSSProperties} /> Legal & Privacy
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                     <Card className="border-none shadow-none">
                        <CardContent className="space-y-2">
                            <Button variant="link" className="p-0 h-auto block text-[--tsb-primary]" style={{'--tsb-primary': TSB_PRIMARY_COLOR} as React.CSSProperties}>View Terms & Conditions</Button>
                            <Button variant="link" className="p-0 h-auto block text-[--tsb-primary]" style={{'--tsb-primary': TSB_PRIMARY_COLOR} as React.CSSProperties}>View Privacy Policy</Button>
                            <Button variant="link" className="p-0 h-auto block text-[--tsb-primary]" style={{'--tsb-primary': TSB_PRIMARY_COLOR} as React.CSSProperties}>Data Usage & Cookies</Button>
                        </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;