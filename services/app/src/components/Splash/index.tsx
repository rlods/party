import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withTranslation, WithTranslation } from "react-i18next";
//
import { MappedProps } from "../../containers/Splash";
import IconButton from "../Common/IconButton";
import "./index.scss";

// ------------------------------------------------------------------

class Splash extends Component<MappedProps & WithTranslation> {
  public render = () => {
    const { loggedIn, onCreateRoom, onConnectUser, t } = this.props;
    return (
      <div className="Splash">
        <div className="Top">
          <div className="Logo">
            <Link to="/">Party</Link>
          </div>
          <div className="PoweredWith">
            <span>{t("splash.powered_with")}</span>
            <a
              href="https://www.deezer.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/deezer.svg"
                height="20px"
                title="Deezer"
                alt="Deezer Logo"
              />
            </a>
          </div>
        </div>
        <div className="Middle">
          <div className="Menu">
            {loggedIn ? (
              <div className="MenuItem">
                <IconButton
                  displayTitle={true}
                  icon="plus"
                  onClick={onCreateRoom}
                  size="L"
                  title={t("rooms.create")}
                />
              </div>
            ) : (
              <>
                <div className="MenuItem">
                  <IconButton
                    displayTitle={true}
                    onClick={onConnectUser}
                    icon="sign-in"
                    size="L"
                    title={t("users.connect")}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="Bottom">
          <div className="Menu">
            {loggedIn ? (
              <div className="MenuItem">
                <IconButton
                  displayTitle={true}
                  icon="sign-out"
                  onClick={this.onDisconnect}
                  size="M"
                  title={t("users.disconnect")}
                />
              </div>
            ) : (
              <div className="MenuItem">
                <IconButton
                  displayTitle={true}
                  icon="info"
                  onClick={() => {}}
                  size="M"
                  title={t("splash.CGU")}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  onDisconnect = () => {
    const { onConfirm, onDisconnectUser, t } = this.props;
    onConfirm(t("users.confirm_disconnect"), onDisconnectUser);
  };
}

export default withTranslation()(Splash);
