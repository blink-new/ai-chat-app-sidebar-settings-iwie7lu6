import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  User as UserIcon, 
  Palette, 
  CreditCard, 
  Plug,
  Moon,
  Sun,
  Monitor,
  Shield,
  Key
} from 'lucide-react'
import { User } from '@/App'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
  onUserUpdate: (user: User) => void
}

export function SettingsDialog({ open, onOpenChange, user, onUserUpdate }: SettingsDialogProps) {
  const [tempUser, setTempUser] = useState(user)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)

  const handleSave = () => {
    onUserUpdate(tempUser)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setTempUser(user)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0 flex-shrink-0">
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex min-h-0 p-6 pr-0">
          <Tabs defaultValue="profile" className="flex-1 flex min-h-0">
            <div className="flex flex-1 min-h-0">
              <TabsList className="flex flex-col h-auto w-48 mr-6 flex-shrink-0">
                <TabsTrigger value="profile" className="w-full justify-start">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="appearance" className="w-full justify-start">
                  <Palette className="w-4 h-4 mr-2" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="account" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="integrations" className="w-full justify-start">
                  <Plug className="w-4 h-4 mr-2" />
                  Integrations
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="profile" className="space-y-6 mt-0">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                          {tempUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" size="sm">Change photo</Button>
                        <p className="text-sm text-muted-foreground mt-1">
                          JPG, PNG or GIF. Max size 2MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full name</Label>
                        <Input
                          id="fullName"
                          value={tempUser.name}
                          onChange={(e) => setTempUser({ ...tempUser, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={tempUser.email}
                          onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label htmlFor="workFunction">What best describes your work?</Label>
                      <Select defaultValue="developer">
                        <SelectTrigger>
                          <SelectValue placeholder="Select your work function" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="developer">Software Developer</SelectItem>
                          <SelectItem value="designer">Designer</SelectItem>
                          <SelectItem value="writer">Writer</SelectItem>
                          <SelectItem value="researcher">Researcher</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label htmlFor="preferences">Personal preferences</Label>
                      <Input
                        id="preferences"
                        placeholder="e.g., keep explanations brief and to the point"
                      />
                      <p className="text-sm text-muted-foreground">
                        Your preferences will apply to all conversations, within Claude's guidelines.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Current Plan</h4>
                    <div className="flex items-center gap-3">
                      <Badge variant={tempUser.plan === 'pro' || tempUser.plan === 'max' ? 'default' : 'secondary'} className={cn(
                        tempUser.plan === 'pro' || tempUser.plan === 'max' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {tempUser.plan === 'pro' ? 'Pro plan' : tempUser.plan === 'max' ? 'Max plan' : 'Free plan'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Manage billing
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-6 mt-0">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-base font-medium">Theme</Label>
                        <p className="text-sm text-muted-foreground mb-3">
                          Choose how Claude looks to you
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'light', label: 'Light', icon: Sun },
                            { value: 'dark', label: 'Dark', icon: Moon },
                            { value: 'system', label: 'System', icon: Monitor }
                          ].map(({ value, label, icon: Icon }) => (
                            <Button
                              key={value}
                              variant={theme === value ? 'default' : 'outline'}
                              className={cn(
                                "h-20 flex-col gap-2",
                                theme === value ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent hover:text-accent-foreground"
                              )}
                              onClick={() => setTheme(value as typeof theme)}
                            >
                              <Icon className="w-5 h-5" />
                              {label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Compact mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Reduce spacing between messages
                          </p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Show timestamps</Label>
                          <p className="text-sm text-muted-foreground">
                            Display message timestamps
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Syntax highlighting</Label>
                          <p className="text-sm text-muted-foreground">
                            Highlight code in messages
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="account" className="space-y-6 mt-0">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Account & Privacy</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about updates and features
                          </p>
                        </div>
                        <Switch checked={notifications} onCheckedChange={setNotifications} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">Auto-save conversations</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically save your chat history
                          </p>
                        </div>
                        <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-base font-medium">Data & Privacy</Label>
                        <div className="space-y-3 mt-3">
                          <Button variant="outline" className="w-full justify-start">
                            <Shield className="w-4 h-4 mr-2" />
                            Download my data
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Key className="w-4 h-4 mr-2" />
                            Change password
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-base font-medium text-destructive">Danger Zone</Label>
                        <div className="space-y-3 mt-3">
                          <Button variant="outline" className="w-full justify-start text-destructive border-destructive">
                            Delete all conversations
                          </Button>
                          <Button variant="outline" className="w-full justify-start text-destructive border-destructive">
                            Delete account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-6 mt-0">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Integrations</h3>
                    
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                              <span className="text-accent-foreground font-semibold">G</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">Google Workspace</h4>
                              <p className="text-sm text-muted-foreground">
                                Connect your Google Drive, Docs, and Calendar
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Connect</Button>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                              <span className="text-primary-foreground font-semibold">N</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">Notion</h4>
                              <p className="text-sm text-muted-foreground">
                                Access and edit your Notion pages
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Connect</Button>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                              <span className="text-accent-foreground font-semibold">S</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">Slack</h4>
                              <p className="text-sm text-muted-foreground">
                                Use Claude in your Slack workspace
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">Connected</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 p-6 pt-0 border-t flex-shrink-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}