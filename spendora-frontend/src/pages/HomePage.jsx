import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-12">
      <section className="grid gap-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center space-y-5">
          <p className="text-sm font-semibold tracking-wide text-orange-600">Spendora</p>
          <h1 className="text-5xl font-bold text-slate-900 md:text-6xl">
            Intelligent Subscription Spend Optimization
          </h1>
          <p className="text-lg text-slate-600">
            Track every subscription, understand real monthly and yearly costs, and generate optimization insights
            that highlight high-cost services and savings opportunities.
          </p>
          <Button size="lg" onClick={() => navigate("/users")}>Get Started</Button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Track subscriptions",
            description: "Capture billing cycles, next billing dates, and true monthly impact for every service."
          },
          {
            title: "Generate insights",
            description: "Launch asynchronous optimization jobs and review auto-generated cost reports."
          },
          {
            title: "Act confidently",
            description: "See which subscriptions are high-cost and get clear suggestions for savings."
          }
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-1 w-16 rounded-full bg-orange-200" />
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
