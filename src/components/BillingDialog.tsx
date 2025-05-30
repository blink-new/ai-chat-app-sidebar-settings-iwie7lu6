import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Check, 
  Crown, 
  Zap, 
  CreditCard,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { User } from '@/App'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

interface BillingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
  onUserUpdate: (user: User) => void
}

interface PlanFeature {
  text: string
  included: boolean
}

interface Plan {
  id: 'free' | 'pro' | 'max'
  name: string
  price: number
  description: string
  badge?: string
  features: PlanFeature[]
  popular?: boolean
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'For getting started',
    features: [
      { text: 'Limited usage', included: true },
      { text: 'Basic models', included: true },
      { text: 'Standard support', included: true },
      { text: 'Advanced models', included: false },
      { text: 'Priority support', included: false },
      { text: 'Early access features', included: false }
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 17,
    description: 'For everyday productivity',
    popular: true,
    features: [
      { text: '5x more usage than Free', included: true },
      { text: 'Access to Claude 3.5 Sonnet and Haiku', included: true },
      { text: 'Create Projects to work with Claude around a set of docs, code, or ideas', included: true },
      { text: 'Priority bandwidth and availability', included: true },
      { text: 'Early access to new features', included: true },
      { text: 'Advanced models', included: true }
    ]
  },
  {
    id: 'max',
    name: 'Max',
    price: 100,
    description: '5-20x more usage than Pro',
    badge: 'Most Popular',
    features: [
      { text: 'Choose 5x or 20x more usage than Pro', included: true },
      { text: 'Higher output limits for all tasks', included: true },
      { text: 'Access Claude Code directly in your terminal', included: true },
      { text: 'Access to advanced Research', included: true },
      { text: 'Connect any context or tool through Integrations', included: true },
      { text: 'Early access to advanced Claude features', included: true },
      { text: 'Priority access at high traffic times', included: true }
    ]
  }
]

export function BillingDialog({ open, onOpenChange, user, onUserUpdate }: BillingDialogProps) {
  const [selectedPlan] = useState<'free' | 'pro' | 'max'>(user.plan)
  const [showPlans, setShowPlans] = useState(true)

  // Mock usage data
  const usageData = {
    current: 45,
    limit: 100,
    resetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }

  const handleUpgrade = (planId: 'free' | 'pro' | 'max') => {
    onUserUpdate({ ...user, plan: planId })
    setShowPlans(false)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (!showPlans) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-foreground">Welcome to {PLANS.find(p => p.id === selectedPlan)?.name}!</DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-muted-foreground mb-6">
              Your plan has been updated successfully. You now have access to all {PLANS.find(p => p.id === selectedPlan)?.name} features.
            </p>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Get started
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-center text-2xl text-foreground">Plans that grow with you</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6">
            <Tabs defaultValue="individual" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
                <TabsTrigger value="individual">Individual</TabsTrigger>
                <TabsTrigger value="team">Team & Enterprise</TabsTrigger>
              </TabsList>

              <TabsContent value="individual">
                {/* Current Usage */}
                {user.plan !== 'free' && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Current Usage
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Messages this month</span>
                          <span>{usageData.current} / {usageData.limit}</span>
                        </div>
                        <Progress value={(usageData.current / usageData.limit) * 100} className="h-2" />
                        <p className="text-sm text-muted-foreground">
                          Resets on {formatDate(usageData.resetDate)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Plans */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {PLANS.map((plan) => (
                    <Card 
                      key={plan.id}
                      className={cn(
                        "relative flex flex-col",
                        plan.popular && "border-primary shadow-lg",
                        user.plan === plan.id && "ring-2 ring-primary"
                      )}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                        </div>
                      )}
                      
                      <CardHeader className="text-center pb-4">
                        <div className="flex items-center justify-center mb-2 h-6">
                          {plan.id === 'free' && <Zap className="w-6 h-6 text-muted-foreground" />}
                          {plan.id === 'pro' && <Crown className="w-6 h-6 text-primary" />}
                          {plan.id === 'max' && <Crown className="w-6 h-6 text-purple-500" />}
                        </div>
                        <CardTitle className="text-xl text-foreground">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="mt-4">
                          <span className="text-3xl font-bold">
                            ${plan.price}
                          </span>
                          {plan.price > 0 && (
                            <span className="text-muted-foreground">/ month billed annually</span>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <Check 
                                className={cn(
                                  "w-4 h-4 mt-0.5 flex-shrink-0",
                                  feature.included ? "text-green-600" : "text-gray-300"
                                )} 
                              />
                              <span 
                                className={cn(
                                  "text-sm",
                                  !feature.included && "text-muted-foreground line-through"
                                )}
                              >
                                {feature.text}
                              </span>
                            </div>
                          ))}
                        </div>

                        <Button
                          className={cn(
                            "w-full mt-6",
                            user.plan === plan.id ? "bg-transparent border border-border text-muted-foreground cursor-default" :
                            plan.popular ? "bg-primary hover:bg-primary/90 text-primary-foreground" :
                            "bg-transparent hover:bg-accent text-accent-foreground border border-border"
                          )}
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={user.plan === plan.id}
                        >
                          {user.plan === plan.id ? (
                            "Current plan"
                          ) : plan.id === 'free' ? (
                            "Downgrade to Free"
                          ) : (
                            `Get ${plan.name} plan`
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Billing Info */}
                {user.plan !== 'free' && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Billing Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Current plan</span>
                          <Badge variant={user.plan === 'pro' ? 'default' : 'secondary'}>
                            {user.plan === 'pro' ? 'Pro plan' : 'Max plan'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Next billing date</span>
                          <span className="text-muted-foreground">
                            {formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Payment method</span>
                          <span className="text-muted-foreground">•••• 4242</span>
                        </div>
                        <div className="pt-4 border-t">
                          <Button variant="outline" className="w-full">
                            <Calendar className="w-4 h-4 mr-2" />
                            Manage billing
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="team" className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-semibold mb-4">Team & Enterprise</h3>
                  <p className="text-muted-foreground mb-6">
                    Get Claude for your team with advanced admin controls, higher usage limits, and priority support.
                  </p>
                  <Button className="w-full">
                    Contact sales
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="text-center text-sm text-muted-foreground mt-6">
              Prices shown do not include applicable tax. 
              <button className="text-primary hover:underline ml-1">
                Usage limits apply.
              </button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}