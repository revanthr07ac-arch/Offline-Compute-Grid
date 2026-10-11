import AuthLoginPage from "./auth/LoginPage";

export default function LoginPage(props: any) {
  return (
    <AuthLoginPage
      onLogin={props.onLogin || (() => {})}
      onForgotPassword={props.onForgotPassword || (() => {})}
      onCreateAccount={props.onCreateAccount || (() => {})}
    />
  );
}
