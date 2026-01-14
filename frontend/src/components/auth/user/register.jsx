import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function AuthRegisters() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    // FIX: defaultValues resolves the "uncontrolled input" warning
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: ""
    }
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      console.log("Data being sent to backend:", data);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/api/v4/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // We parse the result immediately to handle both success and error bodies
      const result = await response.json();

      if (!response.ok) {
        console.error("Backend error response:", result);
        
        // FIX: Extracting the specific error from the backend's error array
        let errorMessage = "Registration failed.";
        if (result.error && Array.isArray(result.error) && result.error.length > 0) {
          // Accessing the 'msg' field inside the first error object of the array
          errorMessage = result.error[0].msg || "Validation error";
        } else if (result.msg) {
          errorMessage = result.msg;
        }
        
        throw new Error(errorMessage);
      }

      console.log("Registration successful:", result);

      toast.success("Mail sent successfully. Verify your account through the mail.", {
        duration: 4000,
      });
      setTimeout(() => navigate("/auth/login"), 3000);
    } catch (error) {
      console.error("Registration error:", error.message);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center max-w-md space-y-6">
      <a href="/">
        <p className="text-[4rem] text-blue-500 font-bold font-unbounded">Booklio</p>
      </a>
      <div className="bg-white w-[140%] shadow-md rounded-lg">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-center text-gray-800">Register User</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-600">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  {...register("name", { required: "Name is required" })}
                  className="mt-2 text-white"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-600">
                  Email
                </Label>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      placeholder="Enter your email"
                      className="mt-2 text-white"
                    />
                  )}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="mobile" className="text-gray-600">
                  Mobile
                </Label>
                <Input
                  type="tel"
                  id="mobile"
                  placeholder="Enter your mobile number"
                  {...register("mobile", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Mobile number must be 10 digits",
                    },
                  })}
                  className="mt-2 text-white"
                />
                {errors.mobile && <p className="text-sm text-red-500">{errors.mobile.message}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-600">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters long",
                      },
                    })}
                    placeholder="Enter your password"
                    className="mt-2 text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 mt-1 text-gray-500 hover:text-gray-300 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 mt-4">
                Register
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-600">
            <p>
              Already have an account?{" "}
              <Link to="/auth/login" className="font-medium text-blue-600 hover:underline">
                Login here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default AuthRegisters;