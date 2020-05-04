import React, { FC } from "react";
import { useTranslation } from "react-i18next";
//
import { Modal } from "../../../components/Modals/Modal";
import { Icon } from "../../../components/Common/Icon";
import { WeaponSelection } from "./WeaponSelection";
import "./HelpModal.scss";

// ------------------------------------------------------------------

export const SeaBattleHelpModal: FC = () => {
	const { t } = useTranslation();
	return (
		<Modal className="SeaBattleHelpModal" title={t("help.help")}>
			<div className="HelpModalSection">
				<div className="HelpModalSectionTitle">
					{t("games.seabattle.help.you_can")}
				</div>
				<ul>
					<li>{t("games.seabattle.help.move_boat")}</li>
					<li>{t("games.seabattle.help.attack_opponent")}</li>
				</ul>
			</div>

			<div className="HelpModalSection">
				<div className="HelpModalSectionTitle">
					{t("games.seabattle.help.to_move")}
				</div>
				<ul>
					<li>{t("games.seabattle.help.select_boat")}</li>
					<li>{t("games.seabattle.help.move_with_keyboard")}</li>
					<li>
						{t("games.seabattle.help.or_use_the_buttons")}
						<br />
						<Icon
							icon="rotate-left"
							size="S"
							title={t("games.seabattle.turn_left")}
						/>
						&nbsp;{t("games.seabattle.turn_left")}
						<br />
						<Icon
							icon="rotate-right"
							size="S"
							title={t("games.seabattle.turn_right")}
						/>
						&nbsp;{t("games.seabattle.turn_right")}
						<br />
						<Icon
							icon="arrow-down"
							size="S"
							title={t("games.seabattle.move_down")}
						/>
						&nbsp;{t("games.seabattle.move_down")}
						<br />
						<Icon
							icon="arrow-up"
							size="S"
							title={t("games.seabattle.move_up")}
						/>
						&nbsp;{t("games.seabattle.move_up")}
						<br />
						<Icon
							icon="arrow-left"
							size="S"
							title={t("games.seabattle.move_left")}
						/>
						&nbsp;{t("games.seabattle.move_left")}
						<br />
						<Icon
							icon="arrow-right"
							size="S"
							title={t("games.seabattle.move_right")}
						/>
						&nbsp;{t("games.seabattle.move_right")}
					</li>
				</ul>
			</div>

			<div className="HelpModalSection">
				<div className="HelpModalSectionTitle">
					{t("games.seabattle.help.to_attack")}
				</div>
				<ul>
					<li>
						{t("games.seabattle.help.select_weapon")}
						<br />
						<WeaponSelection
							weapons={{
								bullet1: 1,
								bullet2: 1,
								bullet3: 0,
								mine: 1
							}}
							weaponType={"bullet1"}
						/>
					</li>
					<li>{t("games.seabattle.help.click_opponent_cell")}</li>
				</ul>
			</div>

			<div className="HelpModalSection">
				<div className="HelpModalSectionTitle">
					{t("games.seabattle.help.to_react")}
				</div>
				<ul>
					<li>{t("games.seabattle.help.missed_hit")}</li>
					<li>{t("games.seabattle.help.hitted_hit")}</li>
				</ul>
			</div>
		</Modal>
	);
};
